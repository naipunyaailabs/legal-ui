import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicDashboard from "./PublicDashboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Plus,
  Trash2,
  Menu,
  X,
  Send,
  Bot,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getConversations, getConversation, createConversation, deleteConversation } from "@/services/legalApi";
import { chatWithAI } from "@/services/legalChatbotApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Use the Conversation interface from legalApi
import { Conversation, ConversationHistory } from "@/services/legalApi";

// Simple layout component for public chat mode to avoid nested sidebars
const SimplePublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {children}
    </div>
  );
};

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed default to true
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicMode = location.pathname.startsWith('/public');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const newConversation = await createConversation("general");

      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setInput("");
      // Only close sidebar on mobile devices
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }

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

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    // Only close sidebar on mobile devices
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
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
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date()
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      // Get AI response
      const response = await chatWithAI(
        input,
        "General Chat",
        currentConversation?.id || "default"
      );

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date()
      };

      setMessages([...newMessages, aiMessage]);

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
        variant: "destructive"
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which layout to use
  const Layout = SimplePublicLayout;

  return (
    <Layout>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar - Only show in public mode */}
        {isPublicMode && (
          <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 ease-in-out flex flex-col border-r bg-muted/10 h-full`}>
            <div className="p-4 border-b">
              <Button
                onClick={createNewConversation}
                className="w-full"
                variant="default"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${currentConversation?.id === conversation.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                      }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage || "New conversation"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2 flex-shrink-0"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${isPublicMode ? 'w-full' : 'w-full'}`}>
          {/* Header */}
          <div className="border-b p-4 flex items-center">
            {isPublicMode && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <h1 className="text-xl font-bold flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              {isPublicMode ? "Legal Chat Assistant" : "Legal AId Chat"}
            </h1>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {isPublicMode ? "Legal Chat Assistant" : "Legal AId Assistant"}
                </h2>
                <p className="text-muted-foreground max-w-md">
                  {isPublicMode
                    ? "Ask any legal question and get simple, easy-to-understand answers."
                    : "Ask any legal question and get expert answers. Start a new conversation or select an existing one."}
                </p>
                <Button
                  onClick={createNewConversation}
                  className="mt-4"
                  variant="default"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarFallback>
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`ml-3 mr-3 p-4 rounded-2xl ${message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                          }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.content
                            .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
                            .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
                            .replace(/__(.*?)__/g, '$1')      // Remove bold underline markdown
                            .replace(/_(.*?)_/g, '$1')        // Remove italic underline markdown
                            .replace(/^#+\s*(.*?)$/gm, '$1')  // Remove headers
                            .replace(/^\s*[\r\n]/gm, '')      // Remove empty lines
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isPublicMode
                    ? "Ask a legal question..."
                    : "Ask a legal question..."}
                  className="flex-1"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;