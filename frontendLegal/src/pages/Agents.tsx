import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Bot,
    MessageSquare,
    FileText,
    FileSearch,
    Send,
    ArrowLeft,
    Sparkles,
    Scale,
    Gavel,
    BookOpen,
    Shield,
    FileCheck,
    Loader2,
    User,
    X,
    Paperclip,
    FileUp,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getAgents,
    createAgentSession,
    chatWithAgent,
    deleteAgentSession,
    uploadDocumentToAgent,
    AgentInfo,
    AgentSessionResponse,
    AgentUploadResponse
} from "@/services/legalChatbotApi";

// Icon mapping for agents
const agentIcons: Record<string, React.ReactNode> = {
    ask: <MessageSquare className="h-6 w-6" />,
    draft: <FileText className="h-6 w-6" />,
    interact: <FileSearch className="h-6 w-6" />,
    research: <BookOpen className="h-6 w-6" />,
    compliance: <Shield className="h-6 w-6" />,
    review: <FileCheck className="h-6 w-6" />,
    default: <Bot className="h-6 w-6" />
};

// Color mapping for agents
const agentColors: Record<string, string> = {
    ask: "from-blue-500 to-cyan-500",
    draft: "from-purple-500 to-pink-500",
    interact: "from-green-500 to-emerald-500",
    research: "from-orange-500 to-amber-500",
    compliance: "from-red-500 to-rose-500",
    review: "from-indigo-500 to-violet-500",
    default: "from-gray-500 to-slate-500"
};

// Placeholder mapping for agents
const agentPlaceholders: Record<string, string> = {
    ask: "Ask me any legal question...",
    draft: "What document would you like me to draft?",
    interact: "Upload a document or ask about analysis...",
    research: "What legal topic would you like to research?",
    compliance: "Describe the compliance matter you need help with...",
    review: "What would you like me to review?",
    default: "Type your message..."
};

// Message type
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const Agents = () => {
    const { toast } = useToast();

    // Agent list state
    const [agents, setAgents] = useState<AgentInfo[]>([]);
    const [loadingAgents, setLoadingAgents] = useState(true);

    // Selected agent and session state
    const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
    const [session, setSession] = useState<AgentSessionResponse | null>(null);
    const [creatingSession, setCreatingSession] = useState(false);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Document upload state (for interact/review agents)
    const [uploadedDocument, setUploadedDocument] = useState<AgentUploadResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load agents on mount
    useEffect(() => {
        loadAgents();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load available agents from API
    const loadAgents = async () => {
        try {
            setLoadingAgents(true);
            const response = await getAgents();
            if (response.success && response.agents) {
                setAgents(response.agents);
            }
        } catch (error) {
            console.error('Failed to load agents:', error);
            toast({
                title: "Failed to load agents",
                description: "Could not fetch available agents. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoadingAgents(false);
        }
    };

    // Handle agent selection
    const handleSelectAgent = async (agent: AgentInfo) => {
        try {
            setSelectedAgent(agent);
            setCreatingSession(true);
            setMessages([]);
            setUploadedDocument(null);

            // Create a new session for this agent
            const sessionResponse = await createAgentSession(agent.id);
            if (sessionResponse.success) {
                setSession(sessionResponse);
                toast({
                    title: `${agent.name} ready`,
                    description: "Session started. You can now chat with this agent."
                });
            }
        } catch (error) {
            console.error('Failed to create agent session:', error);
            toast({
                title: "Failed to start session",
                description: "Could not start agent session. Please try again.",
                variant: "destructive"
            });
            setSelectedAgent(null);
        } finally {
            setCreatingSession(false);
        }
    };

    // Handle back to agent selection
    const handleBack = async () => {
        // Clean up session if exists
        if (selectedAgent && session) {
            try {
                await deleteAgentSession(selectedAgent.id, session.session_id);
            } catch (error) {
                console.error('Failed to delete session:', error);
            }
        }

        setSelectedAgent(null);
        setSession(null);
        setMessages([]);
        setInput("");
        setUploadedDocument(null);
    };

    // Handle file upload for agents that need documents
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedAgent || !session) return;

        try {
            setIsUploading(true);
            const response = await uploadDocumentToAgent(
                selectedAgent.id,
                file,
                session.session_id
            );

            if (response.success) {
                setUploadedDocument(response);
                toast({
                    title: "Document uploaded",
                    description: `${response.filename} is ready for analysis.`
                });
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast({
                title: "Upload failed",
                description: "Could not upload document. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle sending a message
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !selectedAgent || !session) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Call the agent chat API
            const response = await chatWithAgent(selectedAgent.id, {
                session_id: session.session_id,
                message: input,
                context: {
                    include_legal_knowledge: true
                }
            });

            if (response.success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            toast({
                title: "Failed to get response",
                description: "Could not get a response from the agent. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Get icon for agent
    const getAgentIcon = (agentId: string) => {
        return agentIcons[agentId] || agentIcons.default;
    };

    // Get color for agent
    const getAgentColor = (agentId: string) => {
        return agentColors[agentId] || agentColors.default;
    };

    // Get placeholder for agent
    const getAgentPlaceholder = (agentId: string) => {
        return agentPlaceholders[agentId] || agentPlaceholders.default;
    };

    // Check if agent supports document upload
    const supportsDocumentUpload = (agentId: string) => {
        return ['interact', 'review'].includes(agentId);
    };

    // Render loading state
    if (loadingAgents) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading agents...</p>
                </div>
            </div>
        );
    }

    // Render agent selection grid
    const renderAgentGrid = () => (
        <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                        <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                        AI Legal Agents
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Select an agent to get started. Each agent is specialized for different legal tasks.
                    </p>
                </div>

                {agents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No agents available</p>
                        <Button onClick={loadAgents} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <Card
                                key={agent.id}
                                className={cn(
                                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2",
                                    "hover:border-primary/50 group",
                                    !agent.is_active && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => agent.is_active && handleSelectAgent(agent)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                                            getAgentColor(agent.id)
                                        )}>
                                            {getAgentIcon(agent.id)}
                                        </div>
                                        <Badge variant={agent.is_active ? "secondary" : "outline"} className="text-xs">
                                            {agent.is_active ? (
                                                <>
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    AI
                                                </>
                                            ) : (
                                                "Coming Soon"
                                            )}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                                        {agent.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {agent.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5">
                                        {agent.capabilities.map((cap, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs font-normal">
                                                {cap}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Render agent chat interface
    const renderAgentChat = () => {
        if (!selectedAgent) return null;

        return (
            <div className="flex-1 flex flex-col h-full">
                {/* Agent Header */}
                <div className="border-b p-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className={cn(
                        "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md",
                        getAgentColor(selectedAgent.id)
                    )}>
                        {getAgentIcon(selectedAgent.id)}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold">{selectedAgent.name}</h2>
                        <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                    </div>
                    <div className="flex gap-1">
                        {selectedAgent.capabilities.slice(0, 2).map((cap, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                                {cap}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Session creating state */}
                {creatingSession && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Starting session...</p>
                        </div>
                    </div>
                )}

                {/* Messages Area */}
                {!creatingSession && (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                                    <div className={cn(
                                        "h-20 w-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl mb-6",
                                        getAgentColor(selectedAgent.id)
                                    )}>
                                        {getAgentIcon(selectedAgent.id)}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Start a conversation with {selectedAgent.name}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        This agent can help you with:
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {selectedAgent.capabilities.map((cap, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary/10 transition-colors"
                                                onClick={() => setInput(`Help me with ${cap.toLowerCase()}`)}
                                            >
                                                {cap}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex gap-3",
                                                message.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {message.role === "assistant" && (
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback className={cn(
                                                        "bg-gradient-to-br text-white",
                                                        getAgentColor(selectedAgent.id)
                                                    )}>
                                                        <Bot className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "max-w-[80%] rounded-2xl px-4 py-3",
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted rounded-tl-none"
                                            )}>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                            {message.role === "user" && (
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback className="bg-muted">
                                                        <User className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 justify-start">
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback className={cn(
                                                    "bg-gradient-to-br text-white",
                                                    getAgentColor(selectedAgent.id)
                                                )}>
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="border-t p-4">
                            {/* Hidden file input */}
                            {supportsDocumentUpload(selectedAgent.id) && (
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                                    className="hidden"
                                />
                            )}

                            {/* Document uploaded or uploading indicator */}
                            {(uploadedDocument || isUploading) && (
                                <div className="max-w-4xl mx-auto mb-3">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl shadow-sm animate-in zoom-in-95 duration-200">
                                        {isUploading ? (
                                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            </div>
                                        ) : uploadedDocument?.file_type?.startsWith('image/') ? (
                                            <div className="h-10 w-10 rounded-xl overflow-hidden border border-primary/20 bg-white">
                                                <img src={uploadedDocument.preview || ""} alt="uploaded" className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <FileUp className="h-5 w-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex flex-col min-w-0 max-w-[200px]">
                                            <span className="text-sm font-semibold truncate">
                                                {isUploading ? "Uploading file..." : uploadedDocument?.filename}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                                {isUploading ? "Please wait" : `${uploadedDocument?.chunk_count || 0} chunks ready`}
                                            </span>
                                        </div>
                                        {!isUploading && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 ml-2 hover:bg-destructive hover:text-white rounded-full transition-all"
                                                onClick={() => setUploadedDocument(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                                <div className="flex gap-2 items-end">
                                    {supportsDocumentUpload(selectedAgent.id) && (
                                        <Button
                                            type="button"
                                            variant={uploadedDocument ? "default" : "ghost"}
                                            size="icon"
                                            className={cn(
                                                "h-10 w-10 flex-shrink-0 rounded-xl transition-all",
                                                uploadedDocument && "bg-primary/20 hover:bg-primary/30"
                                            )}
                                            disabled={isLoading || isUploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Paperclip className={cn(
                                                    "h-5 w-5",
                                                    uploadedDocument ? "text-primary" : "text-muted-foreground"
                                                )} />
                                            )}
                                        </Button>
                                    )}
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={getAgentPlaceholder(selectedAgent.id)}
                                        className="min-h-[50px] max-h-[200px] resize-none flex-1"
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
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-full w-full bg-background">
            {selectedAgent ? renderAgentChat() : renderAgentGrid()}
        </div>
    );
};

export default Agents;
