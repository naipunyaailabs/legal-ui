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
    Plus,
    Trash2,
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
    FileUp,
    History,
    Zap,
    Gavel,
    Trophy,
    Brain,
    Maximize2,
    Minimize2,
    ChevronDown,
    Shield,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Send,
    Bot,
    User,
    FileText as FileTextIcon,
    MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
    const [showStrategicAnalysis, setShowStrategicAnalysis] = useState(false);

    // Document chat state
    const [documentSession, setDocumentSession] = useState<DocumentUploadResponse | null>(null);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determine if we're in dashboard (authenticated) or public mode
    const isDashboardMode = location.pathname.startsWith('/dashboard/');
    const isPublicMode = location.pathname.startsWith('/public/');

    // UI states
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    // Sidebar resizing state
    const [sidebarWidth, setSidebarWidth] = useState(384);
    const isResizingRef = useRef(false);

    const startResizing = (e: React.MouseEvent) => {
        isResizingRef.current = true;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
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
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 300 && newWidth < 800) {
                setSidebarWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    const [sessionStats, setSessionStats] = useState<any>(null);
    const [embeddingsStatus, setEmbeddingsStatus] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [typingMessages, setTypingMessages] = useState<Record<string, string>>({});
    const [currentLines, setCurrentLines] = useState<Record<string, number>>({});

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
            if (message.role === "assistant" && !typingMessages[message.id] && message.content) {
                const lines = message.content.split('\n');
                let currentLine = 0;
                let displayedContent = "";

                const typeNextLine = () => {
                    if (currentLine < lines.length) {
                        setCurrentLines(prev => ({ ...prev, [message.id]: currentLine }));
                        displayedContent += lines[currentLine] + (currentLine < lines.length - 1 ? '\n' : '');
                        setTypingMessages(prev => ({ ...prev, [message.id]: displayedContent }));
                        currentLine++;
                        timers.push(setTimeout(typeNextLine, 200));
                    }
                };
                timers.push(setTimeout(typeNextLine, 200));
            }
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [messages]);

    useEffect(() => {
        if (isDashboardMode && user) loadConversations();
        if (isPublicMode) loadConversations();
    }, [isDashboardMode, isPublicMode, user]);

    useEffect(() => {
        if (currentConversation?.id) {
            setChatSessionId(currentConversation.id);
            loadConversationMessages(currentConversation.id);
        } else {
            setMessages([]);
            setChatSessionId(null);
        }
    }, [currentConversation?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        loadAdditionalData();
    }, [isDashboardMode, isPublicMode, user]);

    const loadAdditionalData = async () => {
        try {
            setLoadingStats(true);
            const stats = await getSessionStats();
            setSessionStats(stats);
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
            let fetchedConversations: ApiConversation[] = [];
            if (isDashboardMode && user) {
                const backendConversations = await getConversations();
                if (Array.isArray(backendConversations)) fetchedConversations = backendConversations;
            } else if (isPublicMode) {
                // Public mode is transient (In-Memory). No localStorage used.
                fetchedConversations = [];
            }

            setConversations(fetchedConversations);
            if (fetchedConversations.length > 0) {
                if (!currentConversation) setCurrentConversation(fetchedConversations[0]);
            } else {
                createNewConversation();
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        }
    };

    const loadConversationMessages = async (conversationId: string) => {
        try {
            if (!conversationId) return;
            let conversationMessages: Message[] = [];

            if (isDashboardMode && user) {
                const conversation = await getConversation(conversationId);
                if (conversation && conversation.history) {
                    conversationMessages = conversation.history.map((msg, index) => ({
                        id: `${conversationId}-${index}`,
                        role: msg.role as "user" | "assistant",
                        content: msg.content,
                        timestamp: new Date(msg.timestamp || new Date())
                    }));
                }
            } else if (isPublicMode) {
                // Public mode doesn't restore messages from storage
                conversationMessages = [];
            }

            setMessages(conversationMessages);
            const initialTypingMessages: Record<string, string> = {};
            const initialCurrentLines: Record<string, number> = {};
            conversationMessages.forEach(message => {
                if (message.role === "assistant") {
                    initialTypingMessages[message.id] = message.content;
                    initialCurrentLines[message.id] = message.content.split('\n').length;
                }
            });
            setTypingMessages(initialTypingMessages);
            setCurrentLines(initialCurrentLines);
        } catch (error) {
            console.error("Failed to load conversation messages:", error);
        }
    };

    const createNewConversation = async () => {
        try {
            let newConversation: ApiConversation | null = null;
            if (isDashboardMode && user) {
                newConversation = await createConversation("General Chat");
            } else if (isPublicMode) {
                newConversation = {
                    id: `local_${Date.now()}`,
                    title: "New Conversation",
                    lastMessage: "",
                    timestamp: Date.now(),
                    mode: "General Chat"
                };
            }

            if (!newConversation) return;

            const updatedConversations = [newConversation, ...conversations];
            setConversations(updatedConversations);

            setCurrentConversation(newConversation);
            setMessages([]);
            setInput("");
        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    const selectConversation = (conversation: ApiConversation) => {
        if (!currentConversation || currentConversation.id !== conversation.id) {
            setChatSessionId(conversation.id);
            setCurrentConversation(conversation);
        }
    };

    const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            let success = true;
            if (isDashboardMode && user) success = await deleteConversation(conversationId);

            if (success) {
                const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
                setConversations(updatedConversations);

                if (currentConversation?.id === conversationId) {
                    if (updatedConversations.length > 0) {
                        setCurrentConversation(updatedConversations[0]);
                    } else {
                        setCurrentConversation(null);
                        setMessages([]);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        }
    };

    const handleResetSession = async () => {
        try {
            if (await resetSession()) {
                await loadAdditionalData();
                if (isPublicMode) {
                    setMessages([]);
                    setConversations([]);
                    setCurrentConversation(null);
                    createNewConversation();
                }
                toast({ title: "Session reset" });
            }
        } catch (error) {
            console.error("Failed to reset session:", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingDocument(true);
            const response = await uploadDocumentForChat(file);
            if (response.success) {
                setDocumentSession(response);
                toast({ title: "Document uploaded", description: `${response.filename} is ready.` });
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
        } finally {
            setIsUploadingDocument(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveDocument = async () => {
        if (!documentSession?.session_id) return;
        try {
            await deleteDocumentSession(documentSession.session_id);
            setDocumentSession(null);
        } catch (error) {
            console.error('Failed to remove document:', error);
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
            const currentDocSession = documentSession;

            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: messageQuerry,
                timestamp: new Date()
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInput("");
            if (currentDocSession) setDocumentSession(null);

            let responseContent: string;
            if (currentDocSession?.session_id && currentDocSession.session_id !== 'temp') {
                const docResponse = await chatWithDocumentSession(currentDocSession.session_id, messageQuerry, true);
                responseContent = docResponse.answer;
            } else {
                const response = await chatWithAI(messageQuerry, responseMode, currentConversation?.id || "default");
                responseContent = response.response;
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseContent,
                timestamp: new Date()
            };

            const finalMessages = [...newMessages, aiMessage];
            setMessages(finalMessages);

            if (currentConversation) {
                const updatedConversations = conversations.map(conv => {
                    if (conv.id === currentConversation.id) {
                        const updatedConv = { ...conv };
                        if (!conv.title || conv.title === "New Conversation") {
                            updatedConv.title = messageQuerry.substring(0, 30) + (messageQuerry.length > 30 ? "..." : "");
                        }
                        updatedConv.lastMessage = messageQuerry.substring(0, 50) + (messageQuerry.length > 50 ? "..." : "");
                        return updatedConv;
                    }
                    return conv;
                });
                setConversations(updatedConversations);
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const formatLegalContent = (content: string) => {
        if (!content) return null;

        // Pre-process to ensure numbered items mid-paragraph get their own line if needed
        // This handles the "1. ... 2. ..." issue
        const processedContent = content.replace(/(\d+\.\s\*\*)/g, '\n$1');

        const lines = processedContent.split('\n');
        const formattedElements = [];
        let listItems: string[] = [];
        let inList = false;
        let paragraphBuffer: string[] = [];

        const renderText = (text: string) => {
            if (!text) return null;
            // Handle bold text **bold**
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        const flushBuffers = (index: number) => {
            if (paragraphBuffer.length > 0) {
                formattedElements.push(
                    <p key={`para-${index}`} className="text-sm leading-relaxed mb-4 text-foreground/90">
                        {paragraphBuffer.map((line, i) => <span key={i}>{renderText(line)}{i < paragraphBuffer.length - 1 ? ' ' : ''}</span>)}
                    </p>
                );
                paragraphBuffer = [];
            }
            if (inList && listItems.length > 0) {
                formattedElements.push(
                    <ul key={`list-${index}`} className="ml-4 mb-6 space-y-3">
                        {listItems.map((item, i) => (
                            <li key={`li-${index}-${i}`} className="text-sm leading-relaxed pl-6 relative">
                                <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/60" />
                                {renderText(item)}
                            </li>
                        ))}
                    </ul>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
                flushBuffers(index);
                return;
            }

            // Heading detection
            if (trimmedLine.match(/^#{1,3}\s/) || (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 5 && trimmedLine.length < 100 && !trimmedLine.match(/^[0-9\*-\+]/)) || (trimmedLine.endsWith(':') && trimmedLine.length < 80)) {
                flushBuffers(index);
                formattedElements.push(
                    <h3 key={`h3-${index}`} className="text-sm font-bold mt-6 mb-3 flex items-center gap-2 text-primary uppercase tracking-wider">
                        <Scale className="h-3.5 w-3.5" />
                        {trimmedLine.replace(/^#{1,3}\s/, '').replace(/:$/, '')}
                    </h3>
                );
            }
            // List detection (numbers or bullets)
            else if (trimmedLine.match(/^(\d+\.|[\*-\+])\s/)) {
                if (paragraphBuffer.length > 0) {
                    // Don't flush paragraph if it's just the start of a list
                    if (!inList) flushBuffers(index);
                }
                listItems.push(trimmedLine.replace(/^(\d+\.|[\*-\+])\s/, ''));
                inList = true;
            }
            else {
                if (inList) flushBuffers(index);
                paragraphBuffer.push(trimmedLine);
            }
        });

        flushBuffers(lines.length);

        return formattedElements.length > 0 ? formattedElements : <div className="text-sm shadow-inner p-4 rounded-xl bg-muted/20">{renderText(content)}</div>;
    };

    const quickSuggestions = ["What are my rights as a tenant?", "How do I file for divorce?", "What is the statute of limitations?", "How do I create a will?"];

    return (
        <div className="flex h-screen w-full bg-background font-outfit">
            {!isSidebarOpen && (
                <Button variant="outline" size="icon" className="fixed top-20 right-4 z-20" onClick={() => setIsSidebarOpen(true)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {showStrategicAnalysis ? (
                <div className="flex flex-1 w-full animate-in fade-in zoom-in-95 duration-500 overflow-hidden bg-background/50 backdrop-blur-sm">
                    {/* Column 1: Context Sidebar (Case Identity) */}
                    <div className="w-72 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col hidden lg:flex shadow-2xl z-20">
                        <div className="p-6 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-none">Case Intel</h3>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 block">Contextual Data</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40 shadow-sm">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Parties</Label>
                                    <p className="text-sm font-bold mt-1.5 text-foreground leading-snug">Adani Power vs. TATA Steel</p>
                                </div>
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40 shadow-sm">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Presiding Bench</Label>
                                    <p className="text-sm font-bold mt-1.5 text-foreground leading-snug">Justice D.Y. Chandrachud</p>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 px-4 py-6">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2 mb-4 px-2">
                                        <History className="h-3 w-3" />
                                        Legal Precedents
                                    </h4>
                                    <div className="space-y-3">
                                        {["2023-SP-01 (Energy)", "2022-DL-99 (Contract)"].map((item, i) => (
                                            <div key={i} className="p-3.5 rounded-xl border border-border/40 bg-card/30 hover:bg-card hover:border-primary/40 group cursor-pointer transition-all duration-300">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-xs font-bold text-foreground/80">{item}</p>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: i === 0 ? '92%' : '78%' }}></div>
                                                    </div>
                                                    <span className="text-[9px] font-black text-emerald-500">{i === 0 ? '92%' : '78%'} MATCH</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-muted/20 border-t border-border/40">
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all py-4 h-auto border border-dashed border-border/60 rounded-xl" onClick={() => setShowStrategicAnalysis(false)}>
                                <Minimize2 className="h-3 w-3 mr-2" />
                                Standard Mode
                            </Button>
                        </div>
                    </div>

                    {/* Column 2: Strategic Brief (Main Chat) */}
                    <div className="flex-1 flex flex-col bg-background/30 relative overflow-hidden">
                        <header className="h-16 border-b border-border/40 flex items-center justify-between px-8 bg-background/60 backdrop-blur-xl z-20 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group">
                                    <Brain className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </div>
                                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">Strategic Brief</h2>
                            </div>
                            <Badge className="bg-destructive/10 text-destructive border-0 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 flex items-center gap-2 ring-1 ring-destructive/20">
                                <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                                High Exposure
                            </Badge>
                        </header>

                        <ScrollArea className="flex-1 p-10">
                            <div className="max-w-3xl mx-auto space-y-12 pb-24">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
                                        <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                                            <Brain className="h-10 w-10 text-primary opacity-50" />
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight mb-2">Awaiting Analysis</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">Provide case parameters to generate a strategic legal roadmap.</p>
                                    </div>
                                ) : (
                                    messages.map((m) => (
                                        <div key={m.id} className={cn("animate-in fade-in slide-in-from-bottom-6 duration-500", m.role === "user" ? "text-right" : "text-left")}>
                                            <div className={cn(
                                                "inline-block max-w-[90%] text-left p-6 rounded-2xl border shadow-lg relative overflow-hidden group transition-all",
                                                m.role === "assistant"
                                                    ? "bg-card/80 backdrop-blur-md border-border/60"
                                                    : "bg-primary text-primary-foreground border-transparent shadow-primary/20"
                                            )}>
                                                {m.role === "assistant" && <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />}
                                                <div className="text-sm font-medium leading-relaxed">
                                                    {m.role === "assistant" ? formatLegalContent(typingMessages[m.id] || m.content) : m.content}
                                                </div>
                                                <div className={cn("mt-4 text-[9px] font-black uppercase tracking-widest opacity-30", m.role === "user" ? "text-right" : "text-left")}>
                                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-8 bg-gradient-to-t from-background via-background to-transparent sticky bottom-0 z-10">
                            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3 items-end p-2.5 rounded-[1.2rem] bg-card/50 backdrop-blur-2xl border border-primary/20 shadow-2xl focus-within:border-primary/50 transition-all duration-300">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter strategic query..."
                                    className="min-h-[44px] max-h-[150px] resize-none flex-1 border-0 focus-visible:ring-0 bg-transparent py-2.5 px-4 text-sm font-medium"
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
                                    className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-primary to-emerald-600 shadow-lg hover:shadow-primary/30 transition-all duration-300"
                                    disabled={isLoading || !input.trim()}
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Column 3: Tactical Toolbox */}
                    <div className="w-80 border-l border-border/40 bg-card/60 backdrop-blur-xl flex flex-col hidden xl:flex shadow-2xl z-20">
                        <div className="p-6 border-b border-border/40 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Zap className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight leading-none uppercase">Tactical Toolbox</h3>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60 px-2 block mb-4">Offense Manuevers</Label>
                                    <Button variant="outline" className="w-full justify-start h-auto p-4 rounded-xl hover:border-primary/40 hover:bg-primary/5 border-border/60 bg-background/20 group transition-all duration-300" onClick={() => setInput("Identify potential procedural loopholes.")}>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                <span className="font-bold text-[11px] uppercase tracking-wide">Audit Loops</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-snug">Locate jurisdictional flaws or filing errors in opposition brief.</p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-auto p-4 rounded-xl hover:border-emerald-500/40 hover:bg-emerald-500/5 border-border/60 bg-background/20 group transition-all duration-300" onClick={() => setInput("Draft an Interim Application.")}>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <span className="font-bold text-[11px] uppercase tracking-wide">Stay Motion</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-snug">Generate IA for Maintaining Status Quo or Interim Relief.</p>
                                        </div>
                                    </Button>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-border/30">
                                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60 px-2 block mb-2">Predictive Logic</Label>
                                    <Button className="w-full justify-start h-auto p-4 rounded-xl bg-gradient-to-r from-primary to-blue-800 border-0 shadow-lg hover:opacity-90 transition-all duration-300" onClick={() => setInput("Predict outcome simulation.")}>
                                        <div className="text-left text-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Gavel className="h-3.5 w-3.5" />
                                                <span className="font-bold text-[11px] uppercase tracking-wide">Outcome Predictor</span>
                                            </div>
                                            <p className="text-[10px] opacity-70 leading-tight">Ruling probability simulation based on bench precedents.</p>
                                        </div>
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-auto p-4 rounded-xl border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all group duration-300" onClick={() => setInput("Generate 90-day winning plan.")}>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Trophy className="h-3.5 w-3.5" />
                                                <span className="font-bold text-[11px] uppercase tracking-wide">Advocate Roadmap</span>
                                            </div>
                                            <p className="text-[10px] opacity-70 leading-snug">90-day strategic milestone protocol for total dominance.</p>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col transition-[margin] duration-75 ease-out" style={{ marginRight: isSidebarOpen ? sidebarWidth : 0 }}>
                    <ScrollArea className="flex-1 p-2">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto py-20">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Scale className="h-8 w-8 text-primary" /></div>
                                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Legal AI Assistant</h1>
                                <p className="text-muted-foreground mb-8">How can I help you today?</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                    {quickSuggestions.map((s, i) => (
                                        <Button key={i} variant="outline" className="h-auto p-4 text-left justify-start" onClick={() => setInput(s)}>{s}</Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-5xl mx-auto pb-4">
                                {messages.map((m) => (
                                    <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                                        {m.role === "assistant" && (<Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>)}
                                        <div className={cn("max-w-[85%] rounded-2xl px-4 py-3", m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none")}>
                                            <div className="whitespace-pre-wrap text-sm">{m.role === "assistant" ? formatLegalContent(typingMessages[m.id] || m.content) : m.content}</div>
                                        </div>
                                        {m.role === "user" && (<Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-muted text-foreground"><User className="h-4 w-4" /></AvatarFallback></Avatar>)}
                                    </div>
                                ))}
                                {isTyping && <div className="flex space-x-1 p-4"><div className="h-2 w-2 bg-primary rounded-full animate-bounce" /><div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" /><div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" /></div>}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </ScrollArea>

                    <div className="border-t p-4">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        {documentSession && (
                            <div className="max-w-5xl mx-auto mb-3 px-4 flex items-center gap-3 p-2 bg-primary/5 rounded-xl border border-primary/20">
                                <FileTextIcon className="h-6 w-6 text-primary" />
                                <span className="text-sm font-semibold flex-1">{documentSession.filename}</span>
                                <Button variant="ghost" size="icon" onClick={handleRemoveDocument}><X className="h-4 w-4" /></Button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex gap-2">
                            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}><Paperclip className="h-5 w-5" /></Button>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Legal Assistant..."
                                className="min-h-[40px] max-h-[200px] resize-none flex-1 border-0 focus-visible:ring-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <Button type="submit" size="icon" className="h-10 w-10 flex-shrink-0" disabled={isLoading || !input.trim()}>{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</Button>
                        </form>
                    </div>
                </div>
            )}

            {!showStrategicAnalysis && isSidebarOpen && (
                <div className="fixed right-0 top-16 bottom-0 border-l border-border bg-card flex flex-col z-30 shadow-xl" style={{ width: sidebarWidth }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-primary/20 z-50" onMouseDown={startResizing} />
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2"><Settings className="h-5 w-5" />Options</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSidebarOpen(false)}><ChevronRight className="h-5 w-5" /></Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                            <div className="p-1 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-lg cursor-pointer group" onClick={() => setShowStrategicAnalysis(true)}>
                                <div className="bg-card w-full h-16 rounded-xl flex items-center px-4 gap-3">
                                    <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col"><span className="text-xs font-bold uppercase tracking-tight text-primary">Launch Strategic</span><span className="text-[10px] text-muted-foreground uppercase font-bold opacity-70">Analysis View</span></div>
                                    <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Answer Style</Label>
                                <Select value={responseMode} onValueChange={(v: any) => setResponseMode(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Chat">General chat</SelectItem>
                                        <SelectItem value="Document Only">Document Only</SelectItem>
                                        <SelectItem value="Hybrid (Smart)">Hybrid Mode</SelectItem>
                                        <SelectItem value="Layman Explanation">Simple Explanation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Conversations</Label>
                                    <Button variant="ghost" size="sm" onClick={createNewConversation} className="h-6 w-6 p-0"><Plus className="h-3 w-3" /></Button>
                                </div>
                                <div className="space-y-1">
                                    {conversations.map((c) => (
                                        <div key={c.id} className={cn("p-2 rounded-lg cursor-pointer text-sm flex items-center justify-between group", currentConversation?.id === c.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted")} onClick={() => selectConversation(c)}>
                                            <span className="truncate flex-1">{c.title || "New"}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => handleDeleteConversation(c.id, e)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleResetSession}>Reset Session</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1" onClick={() => navigate("/dashboard/interact")}><FileTextIcon className="h-5 w-5" /><span className="text-[10px]">Interact</span></Button>
                                <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1" onClick={() => navigate("/dashboard/draft")}><FileSearch className="h-5 w-5" /><span className="text-[10px]">Draft</span></Button>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
};

export default LegalAssistant;
