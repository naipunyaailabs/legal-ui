import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicDashboard from "./PublicDashboard";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Sparkles,
  Download,
  Clock,
  Loader2,
  BookOpen,
  MessageCircle,
  Scale,
  FileText as FileTextIcon,
  Brain,
  FileSearch,
  MessageSquare,
  User,
  Send,
  Bot,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Settings,
  Wand2,
  Globe,
  Shield,
  Paperclip,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { LegalResearchResponse } from "@/types/api";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { getConversations, getConversation, createConversation, deleteConversation } from "@/services/legalApi";
import { chatWithAI, uploadDocuments } from "@/services/legalChatbotApi";
import { Conversation as ApiConversation } from "@/services/legalApi";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

const Ask = () => {
  const { mode } = useExperienceMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicMode = location.pathname.startsWith('/public');
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [researchResult, setResearchResult] = useState<LegalResearchResponse | null>(null);
  const [responseMode, setResponseMode] = useState<"Hybrid (Smart)" | "Document Only" | "General Chat" | "Layman Explanation">(!isPublicMode ? "Hybrid (Smart)" : "Layman Explanation");

  // File upload state
  const [files, setFiles] = useState<Array<{ name: string; file: File }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Chat states
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ApiConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Typing animation states
  const [typingMessages, setTypingMessages] = useState<Record<string, string>>({});
  const [currentLines, setCurrentLines] = useState<Record<string, number>>({});

  // Effect to handle typing animation for assistant messages (smooth line by line)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Clean up typing messages for messages that no longer exist
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
        // If this is a new assistant message, start typing animation line by line
        if (!typingMessages[message.id] && message.content) {
          const lines = message.content.split('\n');
          let currentLine = 0;
          let displayedContent = "";

          const typeNextLine = () => {
            if (currentLine < lines.length) {
              // Update current line for animation tracking
              setCurrentLines(prev => ({
                ...prev,
                [message.id]: currentLine
              }));

              // Add the next line with its newline character (except for the last line)
              displayedContent += lines[currentLine] + (currentLine < lines.length - 1 ? '\n' : '');
              setTypingMessages(prev => ({
                ...prev,
                [message.id]: displayedContent
              }));
              currentLine++;
              const timer = setTimeout(typeNextLine, 200); // 200ms delay between lines for smoother animation
              timers.push(timer);
            }
          };
          const timer = setTimeout(typeNextLine, 200);
          timers.push(timer);
        }
      }
    });

    // Cleanup function to clear all timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [messages]);

  const isLawyerMode = !isPublicMode;

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadConversationMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close sidebar when user starts typing
  useEffect(() => {
    if (input.trim() && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [input, isSidebarOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    const newFiles = uploadedFiles.map(file => ({
      name: file.name,
      file: file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Reset input value to allow uploading the same file again or new files
    if (e.target) {
      e.target.value = '';
    }

    toast({
      title: "Files selected",
      description: `${uploadedFiles.length} file(s) ready for analysis.`,
    });
  };

  // Trigger file input when paperclip button is clicked
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const loadConversations = async () => {
    try {
      const fetchedConversations = await getConversations();
      setConversations(fetchedConversations);

      // Set first conversation as current if none selected and conversations exist
      if (!currentConversation && fetchedConversations.length > 0) {
        setCurrentConversation(fetchedConversations[0]);
      } else if (fetchedConversations.length === 0) {
        // If no conversations exist, create a new one
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
      const conversation = await getConversation(conversationId);
      const formattedMessages: Message[] = conversation.history.map((msg, index) => ({
        id: `${conversationId}-${index}`,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date()
      }));
      setMessages(formattedMessages);

      // Initialize typing messages for assistant messages
      const initialTypingMessages: Record<string, string> = {};
      const initialCurrentLines: Record<string, number> = {};
      formattedMessages.forEach(message => {
        if (message.role === "assistant") {
          // For loaded messages, show the full content immediately
          initialTypingMessages[message.id] = message.content;
          // Set current line to the last line to ensure all lines are visible
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
      const newConversation = await createConversation("General Chat");

      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setInput("");
      setTypingMessages({}); // Clear typing messages for new conversation
      setCurrentLines({}); // Clear current lines for new conversation

      toast({
        title: "New conversation created",
        description: "Start chatting with the legal AId assistant."
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
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const success = await deleteConversation(conversationId);
      if (success) {
        const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
        setConversations(updatedConversations);

        if (currentConversation?.id === conversationId) {
          // Select the next conversation or create a new one if none left
          if (updatedConversations.length > 0) {
            setCurrentConversation(updatedConversations[0]);
          } else {
            setCurrentConversation(null);
            createNewConversation();
          }
          // Clear typing messages when switching conversations
          setTypingMessages({});
          setCurrentLines({}); // Clear current lines when switching conversations
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || isLoading) return;

    try {
      setIsLoading(true);
      setIsTyping(true);

      // Add user message
      const userMessageContent = input.trim() || (files.length > 0 ? `${files.length} file(s) uploaded` : "");
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userMessageContent,
        timestamp: new Date(),
        attachments: files.map(f => {
          if (f.file.type.startsWith('image/')) {
            return URL.createObjectURL(f.file);
          }
          // For other files, we'll store a special "doc:" prefix to distinguish them
          return `doc:${f.name}`;
        })
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      let response: any;

      // If we have files, upload them first and then get AI response
      if (files.length > 0) {
        // Create FormData for file upload
        const formData = new FormData();
        files.forEach((fileObj) => {
          formData.append('file', fileObj.file);
        });

        // Upload files using the legalChatbotApi service
        try {
          await uploadDocuments(formData);
          toast({
            title: "Files uploaded",
            description: `${files.length} file(s) uploaded successfully.`,
          });

          // Clear uploaded files
          setFiles([]);
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          toast({
            title: "Upload failed",
            description: "Failed to upload files. Please try again.",
            variant: "destructive",
          });
          throw uploadError;
        }
      }

      // Get AI response only if there's text input
      if (input.trim()) {
        response = await chatWithAI(
          input,
          "General Chat",
          currentConversation?.id || "default"
        );
      } else {
        // If only files were uploaded, create a simple response
        response = {
          response: "I've received your file(s). You can now ask questions about them.",
          sources: [],
          tokens_used: 0
        };
      }

      // Add AI message with a small delay for better UX
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response,
          timestamp: new Date()
        };

        setMessages([...newMessages, aiMessage]);
      }, 300);

      // Update conversation title if it's the first message
      if (messages.length === 0 && currentConversation) {
        const updatedConversations = conversations.map(conv =>
          conv.id === currentConversation.id
            ? { ...conv, title: input.substring(0, 30) + (input.length > 30 ? "..." : "") }
            : conv
        );
        setConversations(updatedConversations);
      }

      // Update conversation last message
      if (currentConversation) {
        const updatedConversations = conversations.map(conv =>
          conv.id === currentConversation.id
            ? { ...conv, lastMessage: input.substring(0, 50) + (input.length > 50 ? "..." : "") }
            : conv
        );
        setConversations(updatedConversations);
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
  const handleResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a legal research question.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use the selected response mode
      const mode = responseMode;
      // Map old mode values to new chatbotMode values
      const chatbotMode = (mode as string) === 'document' ? 'Document Only' :
        (mode as string) === 'layman' ? 'Layman Explanation' :
          (mode as string) === 'general' ? 'General Chat' :
            (mode as string) === 'hybrid' ? 'Hybrid (Smart)' : mode;

      // Call the real API
      const response = await chatWithAI(query, chatbotMode);

      // Check if this is a mock response
      const isMockResponse = response.response.includes("Mock response for:");

      // Convert API response to expected format
      const result: LegalResearchResponse = {
        analysis: response.response,
        citations: response.sources.map((source, index) => ({
          title: source.file_name || `Source ${index + 1}`,
          source: source.file_name || "Document"
        })),
        tokens_used: response.tokens_used,
        processing_time: 0, // Not provided by API
        format: responseMode === "General Chat" || responseMode === "Layman Explanation" ? "text" : "irac",
        research_id: "api-research-" + Date.now()
      };

      setResearchResult(result);

      // Show warning if this is a mock response
      if (isMockResponse) {
        toast({
          title: "Mock Response",
          description: "Please set a valid GROQAPIKEY in your .env file to get real AI-powered responses.",
          variant: "destructive",
        });
      }

      toast({
        title: "Research complete!",
        description: getModeDescription(mode),
      });
    } catch (error) {
      toast({
        title: "Research failed",
        description: "Failed to conduct research. Please check your GROQAPIKEY in the .env file and try again.",
        variant: "destructive",
      });
      console.error("Research error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case "Hybrid (Smart)":
        return "Your legal research is ready with IRAC analysis using both document content and general knowledge.";
      case "Document Only":
        return "Your answer is ready using only the information from your uploaded document.";
      case "General Chat":
        return "Your answer is ready using general legal knowledge without document context.";
      case "Layman Explanation":
        return "Your legal answer is ready in simple terms.";
      default:
        return "Your legal research is ready.";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Hybrid (Smart)":
        return <Brain className="h-4 w-4" />;
      case "Document Only":
        return <FileSearch className="h-4 w-4" />;
      case "General Chat":
        return <MessageSquare className="h-4 w-4" />;
      case "Layman Explanation":
        return <User className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getModeTitle = (mode: string) => {
    switch (mode) {
      case "Hybrid (Smart)":
        return "Hybrid Mode (Smart)";
      case "Document Only":
        return "Document Only (RAG) Mode";
      case "General Chat":
        return "General Chat (No RAG) Mode";
      case "Layman Explanation":
        return "Layman Mode";
      default:
        return "Research Mode";
    }
  };

  const getModeExplanation = (mode: string) => {
    switch (mode) {
      case "Hybrid (Smart)":
        return "Uses both your uploaded document AND general legal knowledge for comprehensive answers";
      case "Document Only":
        return "Uses ONLY information from your uploaded document (will say 'I don't know' if not in document)";
      case "General Chat":
        return "Uses general legal knowledge from the AI model, ignoring your uploaded document";
      case "Layman Explanation":
        return "Explains legal concepts in simple, everyday language";
      default:
        return "Default research mode";
    }
  };

  // Parse the IRAC format from the analysis
  const parseIrAcAnalysis = (analysis: string) => {
    const sections = {
      issue: "",
      rule: "",
      application: "",
      conclusion: ""
    };

    // More flexible parsing based on various IRAC formats
    const lines = analysis.split('\n');
    let currentSection = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check for various formats of IRAC section headers
      if (trimmedLine.match(/^\*\*?ISSUE\*\*?:/i) || trimmedLine.match(/^ISSUE:/i) || trimmedLine.match(/^I\./i)) {
        currentSection = "issue";
      } else if (trimmedLine.match(/^\*\*?RULE\*\*?:/i) || trimmedLine.match(/^RULE:/i) || trimmedLine.match(/^R\./i)) {
        currentSection = "rule";
      } else if (trimmedLine.match(/^\*\*?APPLICATION\*\*?:/i) || trimmedLine.match(/^APPLICATION:/i) || trimmedLine.match(/^A\./i) || trimmedLine.match(/^APPLY:/i)) {
        currentSection = "application";
      } else if (trimmedLine.match(/^\*\*?CONCLUSION\*\*?:/i) || trimmedLine.match(/^CONCLUSION:/i) || trimmedLine.match(/^C\./i)) {
        currentSection = "conclusion";
      } else if (currentSection && trimmedLine !== "") {
        sections[currentSection as keyof typeof sections] += line + "\n";
      }
    }

    // If no sections were parsed, try to split the text into roughly equal parts
    if (!sections.issue && !sections.rule && !sections.application && !sections.conclusion) {
      const paragraphs = analysis.split('\n\n').filter(p => p.trim() !== '');
      if (paragraphs.length >= 4) {
        sections.issue = paragraphs[0];
        sections.rule = paragraphs[1];
        sections.application = paragraphs[2];
        sections.conclusion = paragraphs[3];
      } else if (paragraphs.length > 0) {
        // Put everything in the issue section if we can't parse IRAC
        sections.issue = analysis;
      }
    }

    return sections;
  };

  const sections = researchResult ? parseIrAcAnalysis(researchResult.analysis) : null;

  // Quick suggestions for user
  const quickSuggestions = [
    "What are my rights as a tenant?",
    "How do I file for divorce?",
    "What is the statute of limitations for personal injury?",
    "How do I create a will?"
  ];

  // Helper function to format legal content with design system
  const formatLegalContent = (content: string) => {
    if (!content) return null;

    // For testing - log the content to see what we're working with
    console.log("Formatting content:", content);

    // Split content into lines
    const lines = content.split('\n');
    const formattedElements = [];
    let listItems: string[] = [];
    let inList = false;
    let paragraphBuffer: string[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines but flush buffers
      if (trimmedLine === '') {
        // Flush paragraph buffer
        if (paragraphBuffer.length > 0) {
          formattedElements.push(
            <p key={`para-${index}`} className="text-base leading-relaxed mb-4">
              {paragraphBuffer.join(' ')}
            </p>
          );
          paragraphBuffer = [];
        }

        // Flush list
        if (inList && listItems.length > 0) {
          formattedElements.push(
            <ul key={`list-${index}`} className="ml-6 mb-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={`list-item-${index}-${i}`} className="text-base leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-[-12px] before:text-black dark:before:text-white">
                  {item}
                </li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        return;
      }

      // Handle headings
      if (
        trimmedLine.match(/^#{1,3}\s/) ||
        (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 5 && trimmedLine.length < 100 && !trimmedLine.match(/^[\*\-\d\+]/)) ||
        (trimmedLine.endsWith(':') && trimmedLine.length < 80)
      ) {
        // Flush buffers first
        if (paragraphBuffer.length > 0) {
          formattedElements.push(
            <p key={`para-${index}-b`} className="text-base leading-relaxed mb-4">
              {paragraphBuffer.join(' ')}
            </p>
          );
          paragraphBuffer = [];
        }
        if (inList && listItems.length > 0) {
          formattedElements.push(
            <ul key={`list-${index}-b`} className="ml-6 mb-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={`list-item-${index}-${i}`} className="text-base leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-[-12px] before:text-black dark:before:text-white">
                  {item}
                </li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }

        const headingText = trimmedLine.replace(/^#{1,3}\s/, '').replace(/\*$/, '').replace(/:$/, '');
        formattedElements.push(
          <h2 key={`heading-${index}`} className="text-lg font-bold mt-4 mb-2 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            {headingText}
          </h2>
        );
      }
      // Handle list items
      else if (trimmedLine.match(/^[\*\-\d\+]\s/)) {
        if (paragraphBuffer.length > 0) {
          formattedElements.push(
            <p key={`para-${index}-c`} className="text-base leading-relaxed mb-4">
              {paragraphBuffer.join(' ')}
            </p>
          );
          paragraphBuffer = [];
        }
        const listItemText = trimmedLine.replace(/^[\*\-\d\+]\s/, '').trim();
        listItems.push(listItemText);
        inList = true;
      }
      else {
        paragraphBuffer.push(trimmedLine);
      }
    });

    // Final flushes
    if (paragraphBuffer.length > 0) {
      formattedElements.push(
        <p key="para-final" className="text-base leading-relaxed mb-4">
          {paragraphBuffer.join(' ')}
        </p>
      );
    }
    if (inList && listItems.length > 0) {
      formattedElements.push(
        <ul key="list-final" className="ml-6 mb-4 space-y-2">
          {listItems.map((item, i) => (
            <li key={`list-item-final-${i}`} className="text-base leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-[-12px] before:text-black dark:before:text-white">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    // If still empty but we had content, just return the raw content wrapped
    if (formattedElements.length === 0 && content) {
      return <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>;
    }

    return formattedElements;
  };

  // For public mode, we render content directly without a layout wrapper
  if (isPublicMode) {
    return (
      <div className="flex h-screen w-full bg-background">
        {/* Toggle Sidebar Button - Always visible */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed top-16 right-4 z-20 p-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Main Chat Area - scrollable center */}
        <div className={`flex-1 flex flex-col overflow-hidden relative ${isSidebarOpen ? 'mr-96' : ''}`}>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 pb-32">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">How can I help you today?</h2>
                <p className="text-muted-foreground mb-8">
                  Ask any legal question and get expert answers in simple terms.
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
              <div className="space-y-6 max-w-5xl mx-auto pb-20">
                {messages.map((message) => {
                  // For assistant messages, use typing effect
                  const displayContent = message.role === "assistant"
                    ? typingMessages[message.id] || ""
                    : message.content;

                  // Split content into lines for individual line animations
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
                          {message.role === "assistant" ? formatLegalContent(displayContent) : displayContent}
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

            {/* Input Area - Floating */}
            <div className="absolute bottom-6 left-0 right-0 px-4 z-10 pointer-events-none">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pointer-events-auto shadow-2xl rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 p-2">
                <div className="flex gap-2 items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0 rounded-xl"
                    disabled={isLoading}
                    onClick={triggerFileInput}
                  >
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Textarea value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message Legal AId..."
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
                    className="h-10 w-10 flex-shrink-0 rounded-xl mb-1"
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
          </ScrollArea>
        </div>

        {/* Fixed Right Sidebar - Always visible on right */}
        {isSidebarOpen && (
          <div className="fixed right-0 top-16 bottom-0 w-96 border-l border-border bg-card flex flex-col">
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
              <div className="space-y-6">
                {/* Response Mode */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Answer Style
                  </h3>
                  <Select value={responseMode} onValueChange={(value: any) => setResponseMode(value)}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {getModeIcon(responseMode)}
                          <span>{getModeTitle(responseMode)}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Layman Explanation">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Simple Explanation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="General Chat">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Detailed Answer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getModeExplanation(responseMode)}
                  </p>
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
                          "p-3 rounded-lg cursor-pointer transition-colors text-sm",
                          currentConversation?.id === conversation.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted"
                        )}
                        onClick={() => selectConversation(conversation)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{conversation.title}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {conversation.lastMessage || "New conversation"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 flex-shrink-0"
                            onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      onClick={() => navigate("/public/interact")}
                    >
                      <FileTextIcon className="h-5 w-5" />
                      <span className="text-xs">Analyze</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col gap-1"
                      onClick={() => navigate("/public/draft")}
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
  }

  // For lawyer mode
  return (

    <div className="flex h-[calc(100vh-4rem)] w-full">
      {/* Toggle Sidebar Button - Always visible when closed */}
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
      <div className={`flex-1 flex flex-col relative ${isSidebarOpen ? 'mr-96' : ''}`}>
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 pb-32">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">How can I help with your legal research today?</h2>
              <p className="text-muted-foreground mb-8">
                Ask any legal question for comprehensive IRAC analysis and jurisdiction-specific insights.
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
            <div className="space-y-6 max-w-5xl mx-auto pb-20">
              {messages.map((message) => {
                // For assistant messages, use typing effect
                const displayContent = message.role === "assistant"
                  ? typingMessages[message.id] || ""
                  : message.content;

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
                        {message.role === "assistant" ? formatLegalContent(displayContent) : displayContent}
                      </div>

                      {/* Attachments (Images and Documents) */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.attachments.map((url, i) => {
                            if (url.startsWith('doc:')) {
                              const fileName = url.replace('doc:', '');
                              return (
                                <div key={i} className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border px-3 py-2 rounded-xl shadow-sm">
                                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileTextIcon className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-medium max-w-[120px] truncate">{fileName}</span>
                                    <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Document</span>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div key={i} className="max-w-[200px] rounded-lg overflow-hidden border border-border shadow-sm group relative">
                                <img
                                  src={url}
                                  alt="attachment"
                                  className="w-full h-auto object-contain cursor-zoom-in transition-transform group-hover:scale-105"
                                  onClick={() => window.open(url, '_blank')}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <Download className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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

          {/* Input Area - Floating */}
          <div className="absolute bottom-6 left-0 right-0 px-4 z-10 pointer-events-none">
            {/* File Previews with Thumbnails */}
            {files.length > 0 && (
              <div className="max-w-5xl mx-auto mb-3 flex flex-wrap gap-3 pointer-events-auto">
                {files.map((fileObj, index) => {
                  const isImage = fileObj.file.type.startsWith('image/');
                  return (
                    <div key={index} className="group relative flex items-center gap-3 bg-background/95 backdrop-blur-md border border-primary/20 shadow-lg pl-1 pr-3 py-1 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                      {isImage ? (
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-border bg-muted">
                          <img
                            src={URL.createObjectURL(fileObj.file)}
                            alt="preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileTextIcon className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 max-w-[150px]">
                        <span className="text-xs font-semibold truncate">{fileObj.name}</span>
                        <span className="text-[10px] text-muted-foreground">{(fileObj.file.size / 1024).toFixed(0)} KB</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="ml-1 h-6 w-6 flex items-center justify-center bg-muted hover:bg-destructive hover:text-white rounded-full transition-all shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pointer-events-auto shadow-2xl rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 p-2">
              <div className="flex gap-2 items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 rounded-xl"
                  disabled={isLoading}
                  onClick={triggerFileInput}
                >
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Legal AId..."
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
                  className="h-10 w-10 flex-shrink-0 rounded-xl mb-1"
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
        </ScrollArea>

        {/* Fixed Left Sidebar - Always visible on left */}
        {/* Note: Left sidebar goes here if needed */}

        {/* Fixed Right Sidebar - Always visible on right */}
        {isSidebarOpen && (
          <div className="fixed right-0 top-16 bottom-0 w-96 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Research Options
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
              <div className="space-y-6">
                {/* Response Mode */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Response Mode
                  </h3>
                  <Select value={responseMode} onValueChange={(value: any) => setResponseMode(value)}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {getModeIcon(responseMode)}
                          <span>{getModeTitle(responseMode)}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hybrid (Smart)">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span>Hybrid Mode (Smart)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Document Only">
                        <div className="flex items-center gap-2">
                          <FileSearch className="h-4 w-4" />
                          <span>Document Only (RAG) Mode</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="General Chat">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>General Chat (No RAG) Mode</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Layman Explanation">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Layman Mode</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getModeExplanation(responseMode)}
                  </p>
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
                          "p-3 rounded-lg cursor-pointer transition-colors text-sm",
                          currentConversation?.id === conversation.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted"
                        )}
                        onClick={() => selectConversation(conversation)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{conversation.title}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {conversation.lastMessage || "New conversation"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 flex-shrink-0"
                            onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      onClick={() => navigate("/dashboard/interact")}
                    >
                      <FileTextIcon className="h-5 w-5" />
                      <span className="text-xs">Analyze</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col gap-1"
                      onClick={() => navigate("/dashboard/draft")}
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
    </div>

  );
};

export default Ask;