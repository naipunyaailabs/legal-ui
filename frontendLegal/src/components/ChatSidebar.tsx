import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Send,
  Bot,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getConversations, getConversation, createConversation, deleteConversation } from "@/services/legalApi";
import { chatWithAI } from "@/services/legalChatbotApi";
import { Conversation as ApiConversation } from "@/services/legalApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: Date;
}

const ChatSidebar = () => {
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ApiConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-2 border-b">
        <Button 
          onClick={createNewConversation} 
          className="w-full"
          variant="default"
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          New Chat
        </Button>
      </div>
      
      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-2 rounded-lg mb-1 cursor-pointer transition-colors text-xs ${
                currentConversation?.id === conversation.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
              onClick={() => selectConversation(conversation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{conversation.title}</h3>
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
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col border-t">
        <ScrollArea className="flex-1 p-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-2">
              <MessageCircle className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Ask any legal question and get expert answers.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-5 w-5 mt-1 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {message.role === "user" ? <User className="h-2.5 w-2.5" /> : <Bot className="h-2.5 w-2.5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`mx-2 p-2 rounded-lg text-xs ${
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
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
        <div className="p-2 border-t">
          <form onSubmit={handleSubmit} className="flex gap-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              className="flex-1 text-xs h-7"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="sm" className="h-7 w-7 p-0" disabled={isLoading || !input.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;