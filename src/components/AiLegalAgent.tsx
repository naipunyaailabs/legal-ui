import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle, X, Bot, User, Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/api';
import { useExperienceMode } from '@/contexts/ExperienceModeContext';

// Removed import of chatService since backend is removed
// import { chatService } from '@/services/chatService';

interface AiLegalAgentProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInSidebar?: boolean;
}

const AiLegalAgent = ({ isOpen: externalIsOpen, onClose, isInSidebar = false }: AiLegalAgentProps) => {
  const { mode } = useExperienceMode();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose || (() => setInternalIsOpen(false));

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mock response since backend is removed
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: mode === 'lawyer'
            ? `I understand your legal question about "${userMessage.content}". As a legal AId assistant, I can provide general information, but please remember to consult with a qualified attorney for specific legal advice. Based on general legal principles, here's what I can tell you about this topic.`
            : `I understand your question about "${userMessage.content}". Here's a simple explanation: This is a common legal topic that many people have questions about. Generally speaking, the key points are: 1) Understand your rights, 2) Know the basic requirements, 3) Consider seeking professional advice for your specific situation. Would you like me to explain any part in more detail?`,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AId Legal Agent. Please try again.',
        variant: 'destructive'
      });

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }

    // Initialize with a welcome message if chat is empty
    if ((!isOpen && !internalIsOpen) && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'ai',
        content: mode === 'lawyer'
          ? 'Hello! I\'m your AId Legal Assistant. How can I help with your legal research today?'
          : 'Hi there! I\'m here to help explain legal concepts in simple terms. What would you like to know?',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // If in sidebar mode, render the chat interface directly
  if (isInSidebar) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b shrink-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <CardTitle className="text-md">AId Legal Agent</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={clearChat} className="h-6 w-6" title="Reset Conversation">
            <RotateCcw className="h-3 w-3" />
            <span className="sr-only">Clear chat</span>
          </Button>
        </div>

        <CardContent className="flex-1 min-h-0 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`mx-2 p-2 rounded-lg text-xs ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                      <div className="whitespace-pre-wrap break-words">
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="mx-2 p-2 rounded-lg bg-muted">
                      <div className="flex items-center space-x-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t shrink-0">
            <div className="flex space-x-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={mode === 'lawyer' ? "Ask a legal question..." : "Ask about legal concepts..."}
                className="flex-1 !w-auto min-w-0 min-h-[30px] max-h-[80px] resize-none text-xs p-2"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="h-8 w-8"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-3 w-3" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              AId Legal Agent can make mistakes.
            </p>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
      {/* Chat Window */}
      {isOpen && !isInSidebar && (
        <Card className="pointer-events-auto w-[90vw] sm:w-[400px] h-[80vh] max-h-[80vh] flex flex-col shadow-2xl border-border bg-background overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b shrink-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">AId Legal Agent</CardTitle>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={clearChat} title="Reset Conversation">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Clear chat</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 min-h-0 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <div className="whitespace-pre-wrap text-sm break-words">
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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="mx-2 p-3 rounded-lg bg-muted">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t shrink-0">
              <div className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={mode === 'lawyer' ? "Ask a legal question..." : "Ask about legal concepts..."}
                  className="flex-1 !w-auto min-w-0 min-h-[40px] max-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AId Legal Agent can make mistakes. Consider checking important information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button - only show if not controlled externally */}
      {!externalIsOpen && !onClose && (
        <Button
          onClick={toggleChat}
          className="pointer-events-auto h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Legal Agent</span>
        </Button>
      )}
    </div>
  );
};

export default AiLegalAgent;