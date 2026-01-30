import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Sparkles,
    Loader2,
    FileText as FileTextIcon,
    MessageCircle,
    User,
    Send,
    Bot,
    Plus,
    Trash2,
    ChevronRight,
    ChevronLeft,
    Settings,
    Wand2,
    FileSearch,
    Paperclip,
    Scale,
    RefreshCw,
    Activity,
    Database,
    BarChart3,
    LogOut,
    X,
    FileUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getConversations, getConversation, createConversation, deleteConversation, getEmbeddingsStatus, getSessionStats, resetSession } from "@/services/legalApi";
import { chatWithAI, uploadDocumentForChat, chatWithDocumentSession, deleteDocumentSession, DocumentUploadResponse } from "@/services/legalChatbotApi";
import { Conversation as ApiConversation } from "@/services/legalApi";
import { useAuth } from "@/hooks/useAuth";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    attachments?: string[];
}

const LegalAssistant = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ApiConversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<ApiConversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseMode, setResponseMode] = useState<"Hybrid (Smart)" | "Document Only" | "General Chat" | "Layman Explanation">("General Chat");
    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Document chat state
    const [documentSession, setDocumentSession] = useState<DocumentUploadResponse | null>(null);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determine if we're in dashboard (authenticated) or public mode
    const isDashboardMode = location.pathname.startsWith('/dashboard/');
    const isPublicMode = location.pathname.startsWith('/public/');

    // Debug logging
    useEffect(() => {
        console.log('Route mode detection:', {
            pathname: location.pathname,
            isDashboardMode,
            isPublicMode,
            user: !!user
        });
    }, [location.pathname, user]);

    // Clear current conversation when user logs out while in dashboard mode
    useEffect(() => {
        if (!user && isDashboardMode) {
            setCurrentConversation(null);
            setMessages([]);
            setTypingMessages({});
            setCurrentLines({});
            setChatSessionId(null);
        }
    }, [user]);

    // UI states
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    // Sidebar resizing state
    const [sidebarWidth, setSidebarWidth] = useState(384); // Default 96 * 4 = 384px
    const isResizingRef = useRef(false);

    const startResizing = (e: React.MouseEvent) => {
        isResizingRef.current = true;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
    };

    const stopResizing = () => {
        isResizingRef.current = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const resize = (e: MouseEvent) => {
        if (isResizingRef.current) {
            // Calculate new width relative to the right edge of the screen
            const newWidth = window.innerWidth - e.clientX;
            // Min width 300px, Max width 800px (or roughly 50% of typical screen)
            if (newWidth > 300 && newWidth < 800) {
                setSidebarWidth(newWidth);
            }
        }
    };

    // Cleanup resize listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    // Additional data states
    const [sessionStats, setSessionStats] = useState<any>(null);
    const [embeddingsStatus, setEmbeddingsStatus] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Typing animation states
    const [typingMessages, setTypingMessages] = useState<Record<string, string>>({});
    const [currentLines, setCurrentLines] = useState<Record<string, number>>({});

    // Effect to handle typing animation
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        const currentMessageIds = messages.map(m => m.id);
        const typingMessageIds = Object.keys(typingMessages);
        const obsoleteIds = typingMessageIds.filter(id => !currentMessageIds.includes(id));

        if (obsoleteIds.length > 0) {
            setTypingMessages(prev => {
                const updated = { ...prev };
                obsoleteIds.forEach(id => delete updated[id]);
                return updated;
            });
            setCurrentLines(prev => {
                const updated = { ...prev };
                obsoleteIds.forEach(id => delete updated[id]);
                return updated;
            });
        }

        messages.forEach((message) => {
            if (message.role === "assistant") {
                if (!typingMessages[message.id] && message.content) {
                    const lines = message.content.split('\n');
                    let currentLine = 0;
                    let displayedContent = "";

                    const typeNextLine = () => {
                        if (currentLine < lines.length) {
                            setCurrentLines(prev => ({
                                ...prev,
                                [message.id]: currentLine
                            }));

                            displayedContent += lines[currentLine] + (currentLine < lines.length - 1 ? '\n' : '');
                            setTypingMessages(prev => ({
                                ...prev,
                                [message.id]: displayedContent
                            }));
                            currentLine++;
                            const timer = setTimeout(typeNextLine, 200);
                            timers.push(timer);
                        }
                    };
                    const timer = setTimeout(typeNextLine, 200);
                    timers.push(timer);
                }
            }
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [messages]);

    // Load conversations on mount
    useEffect(() => {
        if (isDashboardMode && user) loadConversations();
        if (isPublicMode) loadConversations();
    }, [isDashboardMode, isPublicMode]);
    // Cleanup localStorage on browser close for public mode
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Clear individual conversation messages on browser close
            // This ensures conversations don't persist across browser sessions
            if (isPublicMode) {
                // Get all conversation IDs and clear their messages
                const savedConversations = localStorage.getItem('legalAssistant_conversations');
                if (savedConversations) {
                    try {
                        const conversations = JSON.parse(savedConversations);
                        conversations.forEach((conv: any) => {
                            localStorage.removeItem(`legalAssistant_messages_${conv.id}`);
                        });
                        // Clear the conversation list too for a clean start
                        localStorage.removeItem('legalAssistant_conversations');
                    } catch (e) {
                        console.error('Failed to clear conversation messages:', e);
                    }
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isPublicMode]);

    // Load messages when conversation changes
    useEffect(() => {
        if (currentConversation?.id) {
            setChatSessionId(currentConversation.id);
            loadConversationMessages(currentConversation.id);
        } else {
            setMessages([]);
            setChatSessionId(null);
        }
    }, [currentConversation?.id, isDashboardMode, isPublicMode, user]);

    // Scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close sidebar when typing
    useEffect(() => {
        if (input.trim() && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [input, isSidebarOpen]);

    // Load additional data (stats, embeddings status)
    useEffect(() => {
        loadAdditionalData();
    }, [isDashboardMode, isPublicMode, user]);

    const loadAdditionalData = async () => {
        try {
            setLoadingStats(true);
            // Load session statistics
            const stats = await getSessionStats();
            setSessionStats(stats);

            // Load embeddings status
            const status = await getEmbeddingsStatus();
            setEmbeddingsStatus(status);
        } catch (error) {
            console.error("Failed to load additional data:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversations = async () => {
        try {
            console.log('loadConversations called', { isDashboardMode, isPublicMode, user });
            let fetchedConversations: ApiConversation[] = [];

            // For dashboard mode (authenticated users), load from backend
            if (isDashboardMode && user) {
                console.log('Loading conversations from backend for user:', user.id);
                const backendConversations = await getConversations();
                console.log('Backend conversations:', backendConversations);
                // Validate that backendConversations is an array
                if (Array.isArray(backendConversations)) {
                    fetchedConversations = backendConversations;
                } else {
                    console.warn('Backend conversations is not an array:', typeof backendConversations, backendConversations);
                    fetchedConversations = [];
                }
            }
            // For public mode (anonymous users), load from localStorage
            else if (isPublicMode) {
                console.log('Loading conversations from localStorage');
                const savedConversations = localStorage.getItem('legalAssistant_conversations');
                console.log('Saved conversations from localStorage:', savedConversations);
                if (savedConversations) {
                    try {
                        const parsedConversations = JSON.parse(savedConversations);
                        // Validate that parsedConversations is an array
                        if (Array.isArray(parsedConversations)) {
                            fetchedConversations = parsedConversations;
                        } else {
                            console.warn('Parsed conversations is not an array:', typeof parsedConversations, parsedConversations);
                            fetchedConversations = [];
                        }
                    } catch (e) {
                        console.error('Failed to parse saved conversations:', e);
                        fetchedConversations = [];
                    }
                }
            }

            console.log('Setting conversations:', fetchedConversations);
            setConversations(fetchedConversations);

            // Set current conversation logic
            if (fetchedConversations.length > 0) {
                // If we don't have a current conversation, set the first one as current
                if (!currentConversation) {
                    console.log('Setting first conversation as current');
                    setCurrentConversation(fetchedConversations[0]);
                }
                // If we do have a current conversation, make sure it's still in the list and update it if needed
                else if (fetchedConversations.some(conv => conv.id === currentConversation.id)) {
                    // Find the updated version of the current conversation
                    const updatedCurrent = fetchedConversations.find(conv => conv.id === currentConversation.id);
                    if (updatedCurrent) {
                        // Check if the conversation data has changed
                        if (JSON.stringify(updatedCurrent) !== JSON.stringify(currentConversation)) {
                            console.log('Updating current conversation with fresh data');
                            setCurrentConversation(updatedCurrent);
                        }
                    }
                }
                // If the current conversation is no longer in the list, set the first one as current
                else {
                    console.log('Current conversation no longer exists, setting first conversation as current');
                    setCurrentConversation(fetchedConversations[0]);
                }
            } else {
                console.log('No conversations found, creating new conversation');
                createNewConversation();
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
            toast({
                title: "Error",
                description: "Failed to load conversations.",
                variant: "destructive"
            });
        }
    };

    const loadConversationMessages = async (conversationId: string) => {
        try {
            // Guard against undefined conversation ID
            if (!conversationId) {
                console.error('Cannot load messages with undefined conversation ID');
                setMessages([]);
                return;
            }

            console.log('Loading conversation messages...', { conversationId, isDashboardMode, isPublicMode, user });
            let conversationMessages: Message[] = [];

            // For dashboard mode (authenticated users), load from backend
            if (isDashboardMode && user) {
                console.log('Loading from backend for user:', user.id);
                const conversation = await getConversation(conversationId);
                console.log('Backend conversation data:', conversation);
                if (conversation && conversation.history) {
                    conversationMessages = conversation.history.map((msg, index) => ({
                        id: `${conversationId}-${index}`,
                        role: msg.role as "user" | "assistant",
                        content: msg.content,
                        timestamp: new Date(msg.timestamp || new Date())
                    }));
                }
            }
            // For public mode (anonymous users), load from localStorage
            else if (isPublicMode) {
                console.log('Loading from localStorage...');
                const savedMessages = localStorage.getItem(`legalAssistant_messages_${conversationId}`);
                console.log('Saved messages from localStorage:', savedMessages);
                if (savedMessages) {
                    try {
                        const parsedMessages = JSON.parse(savedMessages);
                        // Validate that parsedMessages is an array
                        if (Array.isArray(parsedMessages)) {
                            conversationMessages = parsedMessages;
                        } else {
                            console.warn('Parsed messages is not an array:', typeof parsedMessages, parsedMessages);
                            conversationMessages = [];
                        }
                    } catch (e) {
                        console.error('Failed to parse saved messages:', e);
                        conversationMessages = [];
                    }
                }
            }

            console.log('Setting messages:', conversationMessages);
            setMessages(conversationMessages);

            const initialTypingMessages: Record<string, string> = {};
            const initialCurrentLines: Record<string, number> = {};
            conversationMessages.forEach(message => {
                if (message.role === "assistant") {
                    initialTypingMessages[message.id] = message.content;
                    const lines = message.content.split('\n');
                    initialCurrentLines[message.id] = lines.length;
                }
            });
            setTypingMessages(initialTypingMessages);
            setCurrentLines(initialCurrentLines);
        } catch (error) {
            console.error("Failed to load conversation messages:", error);
            toast({
                title: "Error",
                description: "Failed to load conversation messages.",
                variant: "destructive"
            });
        }
    };

    const createNewConversation = async () => {
        try {
            let newConversation: ApiConversation | null = null;

            // For dashboard mode (authenticated users), create on backend
            if (isDashboardMode && user) {
                console.log('Creating new conversation for user:', user.id);
                newConversation = await createConversation("General Chat");
                console.log('New conversation created:', newConversation);
                // Ensure the ID is properly set
                if (newConversation && newConversation.id) {
                    setChatSessionId(newConversation.id);
                }
            }
            // For public mode (anonymous users), create locally
            else if (isPublicMode) {
                const conversationId = `local_${Date.now()}`;
                newConversation = {
                    id: conversationId,
                    title: "New Conversation",
                    lastMessage: "",
                    timestamp: Date.now(),
                    mode: "General Chat"
                };
            }

            // Guard against undefined conversations
            if (!newConversation) {
                console.error("Failed to create new conversation");
                return;
            }

            // Update conversations list
            const updatedConversations = [newConversation, ...conversations];
            setConversations(updatedConversations);

            // For public mode, save to localStorage
            if (isPublicMode) {
                localStorage.setItem('legalAssistant_conversations', JSON.stringify(updatedConversations));
            }

            setCurrentConversation(newConversation);
            if (newConversation?.id) {
                setChatSessionId(newConversation.id);
            }
            setMessages([]);
            setInput("");
            setTypingMessages({});
            setCurrentLines({});

            toast({
                title: "New conversation created",
                description: "Start chatting with the Legal Assistant."
            });
        } catch (error) {
            console.error("Failed to create conversation:", error);
            toast({
                title: "Error",
                description: "Failed to create new conversation.",
                variant: "destructive"
            });
        }
    };

    const selectConversation = (conversation: ApiConversation) => {
        console.log('Selecting conversation:', conversation);
        // Only update if it's actually a different conversation
        if (!currentConversation || currentConversation.id !== conversation.id) {
            console.log('Setting new conversation:', conversation);
            // Set the chat session ID first
            setChatSessionId(conversation.id);
            setCurrentConversation(conversation);
            // Load the messages for the selected conversation
            loadConversationMessages(conversation.id);
        }
    };
    const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            // Guard against undefined conversation ID
            if (!conversationId) {
                console.error('Cannot delete conversation with undefined ID');
                toast({
                    title: "Error",
                    description: "Cannot delete conversation: invalid ID",
                    variant: "destructive"
                });
                return;
            }

            let success = true;

            // For dashboard mode (authenticated users), delete from backend
            if (isDashboardMode && user) {
                console.log('Deleting conversation for user:', user.id, 'conversationId:', conversationId);
                success = await deleteConversation(conversationId);
            }

            if (success) {
                const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
                setConversations(updatedConversations);

                // For public mode, save to localStorage
                if (isPublicMode) {
                    localStorage.setItem('legalAssistant_conversations', JSON.stringify(updatedConversations));
                    // Also remove the messages for this conversation
                    localStorage.removeItem(`legalAssistant_messages_${conversationId}`);
                }

                if (currentConversation?.id === conversationId) {
                    if (updatedConversations.length > 0) {
                        setCurrentConversation(updatedConversations[0]);
                        setChatSessionId(updatedConversations[0].id);
                    } else {
                        setCurrentConversation(null);
                        setMessages([]);
                        setChatSessionId(null);
                    }
                    setTypingMessages({});
                    setCurrentLines({});
                }

                toast({
                    title: "Conversation deleted",
                    description: "The conversation has been removed."
                });
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            toast({
                title: "Error",
                description: "Failed to delete conversation.",
                variant: "destructive"
            });
        }
    };

    const handleResetSession = async () => {
        try {
            const success = await resetSession();
            if (success) {
                // Reload additional data after reset
                await loadAdditionalData();
                toast({
                    title: "Session reset",
                    description: "Your session has been reset successfully."
                });
            }
        } catch (error) {
            console.error("Failed to reset session:", error);
            toast({
                title: "Error",
                description: "Failed to reset session.",
                variant: "destructive"
            });
        }
    };

    const handleRefreshData = async () => {
        await loadAdditionalData();
        toast({
            title: "Data refreshed",
            description: "Session data has been updated."
        });
    };

    // Handle file selection and upload for document chat
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/png', 'image/jpeg'];
        const allowedExtensions = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a PDF, DOCX, TXT, PNG, or JPG file.",
                variant: "destructive"
            });
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload a file smaller than 10MB.",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsUploadingDocument(true);
            // Show local preview immediately if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setDocumentSession({
                        success: true,
                        session_id: 'temp',
                        filename: file.name,
                        file_type: file.type,
                        preview: e.target?.result as string,
                        char_count: 0,
                        chat_history_length: 0
                    } as any);
                };
                reader.readAsDataURL(file);
            }
            const response = await uploadDocumentForChat(file);

            if (response.success) {
                setDocumentSession(response);
                toast({
                    title: "Document uploaded",
                    description: `${response.filename} is ready. Ask questions about it!`,
                });
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast({
                title: "Upload failed",
                description: "Failed to upload document. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploadingDocument(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle removing the uploaded document
    const handleRemoveDocument = async () => {
        if (!documentSession?.session_id) return;

        try {
            await deleteDocumentSession(documentSession.session_id);
            setDocumentSession(null);
            toast({
                title: "Document removed",
                description: "You can now chat normally or upload another document."
            });
        } catch (error) {
            console.error('Failed to remove document:', error);
            // Still remove locally even if API fails
            setDocumentSession(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        try {
            setIsLoading(true);
            setIsTyping(true);

            const messageQuerry = input.trim();
            const currentDocSession = documentSession; // Store ref

            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: messageQuerry,
                timestamp: new Date(),
                attachments: (currentDocSession?.file_type?.startsWith('image/')) ? [currentDocSession.preview || ''] : undefined
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInput("");

            // If it's a "one-off" document upload, clear the preview box
            if (currentDocSession) {
                setDocumentSession(null);
            }

            let responseContent: string;
            let conversationIdFromResponse: string | undefined;

            // If a document is uploaded, use document chat API
            if (currentDocSession?.session_id && currentDocSession.session_id !== 'temp') {
                // If query is very short/generic, nudge the AI to summarize
                const enhancedQuery = (messageQuerry.length < 15 && (messageQuerry.toLowerCase().includes("this") || messageQuerry.toLowerCase().includes("document")))
                    ? `Analyze and summarize this document for me: ${messageQuerry}`
                    : messageQuerry;

                const docResponse = await chatWithDocumentSession(
                    currentDocSession.session_id,
                    enhancedQuery,
                    true // include_legal_knowledge
                );
                responseContent = docResponse.answer;
                conversationIdFromResponse = docResponse.session_id;
            } else {
                // Otherwise use regular chat API
                const response = await chatWithAI(
                    messageQuerry,
                    responseMode,
                    currentConversation?.id || "default"
                );
                responseContent = response.response;
                conversationIdFromResponse = response.conversation_id;
            }

            // Store the chat session ID from response
            if (conversationIdFromResponse) {
                setChatSessionId(conversationIdFromResponse);
            }

            // Immediately add the AI response to the conversation
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseContent,
                timestamp: new Date()
            };

            const finalMessages = [...newMessages, aiMessage];
            setMessages(finalMessages);

            // For public mode, save messages to localStorage
            if (isPublicMode && currentConversation) {
                localStorage.setItem(`legalAssistant_messages_${currentConversation.id}`, JSON.stringify(finalMessages));
            }

            // For dashboard mode, refresh the conversation to get updated history from backend
            if (isDashboardMode && user && currentConversation) {
                try {
                    // Refresh the current conversation from the backend
                    const updatedConversation = await getConversation(currentConversation.id);
                    if (updatedConversation) {
                        // Update the conversations list with the refreshed conversation
                        const updatedConversations = conversations.map(conv =>
                            conv.id === currentConversation.id
                                ? { ...conv, lastMessage: input.substring(0, 50) + (input.length > 50 ? "..." : "") }
                                : conv
                        );
                        setConversations(updatedConversations);
                    }
                } catch (refreshError) {
                    console.error('Failed to refresh conversation:', refreshError);
                }
            }

            // Update conversation title and last message
            if (currentConversation) {
                const updatedConversations = conversations.map(conv => {
                    if (conv.id === currentConversation.id) {
                        // For first message, update title; for all messages, update last message
                        const updatedConv = { ...conv };
                        if (!conv.title || conv.title === "New Conversation" || conv.title === "General Chat" || conv.title.trim() === "") {
                            updatedConv.title = input.substring(0, 30) + (input.length > 30 ? "..." : "");
                        }
                        updatedConv.lastMessage = input.substring(0, 50) + (input.length > 50 ? "..." : "");
                        return updatedConv;
                    }
                    return conv;
                });

                setConversations(updatedConversations);

                // For public mode, save to localStorage
                if (isPublicMode) {
                    localStorage.setItem('legalAssistant_conversations', JSON.stringify(updatedConversations));
                }

                // For dashboard mode, update the current conversation state
                if (isDashboardMode && user) {
                    const updatedCurrent = updatedConversations.find(conv => conv.id === currentConversation.id);
                    if (updatedCurrent) {
                        setCurrentConversation(updatedCurrent);
                    }
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to get response. Please try again.",
                variant: "destructive",
            });
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const quickSuggestions = [
        "What are my rights as a tenant?",
        "How do I file for divorce?",
        "What is the statute of limitations for personal injury?",
        "How do I create a will?"
    ];

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Toggle Sidebar Button */}
            {!isSidebarOpen && (
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-20 right-4 z-20 p-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {/* Main Chat Area */}
            <div
                className="flex-1 flex flex-col transition-[margin] duration-75 ease-out"
                style={{ marginRight: isSidebarOpen ? sidebarWidth : 0 }}
            >
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-2">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Scale className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                How can I help you today?
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Ask any legal question and get expert answers.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                                {quickSuggestions.map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto p-4 text-left justify-start whitespace-normal break-words hover:border-primary/50 transition-colors"
                                        onClick={() => setInput(suggestion)}
                                    >
                                        <span className="text-sm">{suggestion}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-5xl mx-auto pb-4">
                            {messages.map((message) => {
                                const displayContent = message.role === "assistant"
                                    ? typingMessages[message.id] || ""
                                    : message.content;

                                const lines = displayContent.split('\n');
                                const currentLine = message.role === "assistant" ? currentLines[message.id] || 0 : lines.length;

                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {message.role === "assistant" && (
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3",
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted rounded-tl-none"
                                        )}>
                                            <div className="whitespace-pre-wrap text-sm">
                                                {message.attachments && message.attachments.length > 0 && (
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {message.attachments.map((url, i) => (
                                                            <div key={i} className="max-w-[280px] rounded-xl overflow-hidden shadow-md bg-background group/img relative">
                                                                <img
                                                                    src={url}
                                                                    alt="attachment"
                                                                    className="w-full h-auto object-contain cursor-zoom-in transition-transform group-hover/img:scale-[1.02]"
                                                                    onClick={() => window.open(url, '_blank')}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {lines.map((line, index) => (
                                                    <div
                                                        key={index}
                                                        className={cn(
                                                            "transition-all duration-300 ease-out",
                                                            index > currentLine ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                                                        )}
                                                    >
                                                        {line
                                                            .replace(/\*\*(.*?)\*\*/g, '$1')
                                                            .replace(/\*(.*?)\*/g, '$1')
                                                            .replace(/__(.*?)__/g, '$1')
                                                            .replace(/_(.*?)_/g, '$1')
                                                            .replace(/^#+\s*(.*?)$/gm, '$1')
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {message.role === "user" && (
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback className="bg-muted text-foreground">
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '600ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area - Fixed at bottom, outside of scrollable area */}
                <div className="border-t p-4">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                        className="hidden"
                    />

                    {documentSession && (
                        <div className="max-w-5xl mx-auto mb-3 px-4">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl shadow-sm animate-in zoom-in-95 duration-200">
                                {documentSession.file_type?.startsWith('image/') ? (
                                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-primary/20 bg-white shadow-inner">
                                        <img src={documentSession.preview || ""} alt="uploaded" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileTextIcon className="h-6 w-6 text-primary" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{documentSession.filename}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                        {isUploadingDocument ? "Uploading..." : "Ready for analysis"}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-2 hover:bg-destructive hover:text-white rounded-full transition-all"
                                    onClick={handleRemoveDocument}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                        <div className="flex gap-2 items-end">
                            <Button
                                type="button"
                                variant={documentSession ? "default" : "ghost"}
                                size="icon"
                                className={cn(
                                    "h-10 w-10 flex-shrink-0 rounded-xl transition-all",
                                    documentSession && "bg-primary/20 hover:bg-primary/30"
                                )}
                                disabled={isLoading || isUploadingDocument}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploadingDocument ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Paperclip className={cn(
                                        "h-5 w-5",
                                        documentSession ? "text-primary" : "text-muted-foreground"
                                    )} />
                                )}
                            </Button>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={documentSession
                                    ? `Ask a question about ${documentSession.filename}...`
                                    : "Message Legal Assistant..."
                                }
                                className="min-h-[50px] max-h-[200px] resize-none flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-10 w-10 flex-shrink-0 rounded-xl"
                                disabled={isLoading || !input.trim()}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Fixed Right Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed right-0 top-16 bottom-0 border-l border-border bg-card flex flex-col z-30 shadow-xl"
                    style={{ width: sidebarWidth }}
                >
                    {/* Resize Handle */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-primary/20 transition-colors z-50 flex items-center justify-center -ml-1 group touch-none"
                        onMouseDown={startResizing}
                    >
                        {/* Visual handle indicator */}
                        <div className="w-1 h-8 bg-muted-foreground/20 rounded-full group-hover:bg-primary/50 transition-colors" />
                    </div>
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Options
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 -mr-2"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6 pr-4">
                            {/* Response Mode */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-sm flex items-center gap-2">
                                    <Wand2 className="h-4 w-4" />
                                    Answer Style
                                </h3>
                                <Select value={responseMode} onValueChange={(value: any) => setResponseMode(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Chat">General chat</SelectItem>
                                        <SelectItem value="Layman Explanation">Simple Explanation</SelectItem>
                                        <SelectItem value="Hybrid (Smart)">Hybrid Mode</SelectItem>
                                        <SelectItem value="Document Only">Document Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Conversations */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        Conversations
                                    </h3>
                                    <Button
                                        onClick={createNewConversation}
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {conversations.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            className={cn(
                                                "relative p-3 pr-10 rounded-lg cursor-pointer transition-colors text-sm",
                                                currentConversation?.id === conversation.id
                                                    ? "bg-primary/10 border border-primary/20"
                                                    : "hover:bg-muted"
                                            )}
                                            onClick={() => selectConversation(conversation)}
                                        >

                                            <div className="min-w-0">

                                                <h4 className="font-medium truncate">{conversation.title}</h4>
                                                <p className="text-xs text-muted-foreground truncate mt-1">
                                                    {conversation.lastMessage || "New conversation"}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-1 h-6 w-6 opacity-60 hover:opacity-100"
                                                onClick={(e) => handleDeleteConversation(conversation.id, e)}
                                            >

                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Session Statistics */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        Session Stats
                                    </h3>
                                    {loadingStats && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>

                                {sessionStats && (
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-muted/50 p-2 rounded">
                                            <div className="font-medium">Queries</div>
                                            <div className="text-muted-foreground">{sessionStats.total_queries}</div>
                                        </div>
                                        <div className="bg-muted/50 p-2 rounded">
                                            <div className="font-medium">Tokens</div>
                                            <div className="text-muted-foreground">{sessionStats.total_tokens_used?.toLocaleString() || 0}</div>
                                        </div>
                                        <div className="bg-muted/50 p-2 rounded">
                                            <div className="font-medium">Flagged</div>
                                            <div className="text-muted-foreground">{sessionStats.flagged_queries || 0}</div>
                                        </div>
                                        <div className="bg-muted/50 p-2 rounded">
                                            <div className="font-medium">Duration</div>
                                            <div className="text-muted-foreground">{Math.round(sessionStats.session_duration_seconds || 0)}s</div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Session Management */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-sm flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    Session Management
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={handleResetSession}
                                >
                                    Reset Session
                                </Button>
                            </div>

                            {/* Tools */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-sm flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Legal Tools
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-16 flex flex-col gap-1"
                                        onClick={() => navigate(user ? "/dashboard/interact" : "/public/interact")}
                                    >
                                        <FileTextIcon className="h-5 w-5" />
                                        <span className="text-xs">Interact</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-16 flex flex-col gap-1"
                                        onClick={() => navigate(user ? "/dashboard/draft" : "/public/draft")}
                                    >
                                        <FileSearch className="h-5 w-5" />
                                        <span className="text-xs">Draft</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
};

export default LegalAssistant;
