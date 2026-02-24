import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  History,
  Zap,
  ShieldCheck,
  ChevronDown,
  Gavel,
  Trophy,
  Activity,
  Maximize2,
  Minimize2,
  Cpu,
  Target,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { LegalResearchResponse } from "@/types/api";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { 
  getConversations, 
  getConversation, 
  createConversation, 
  deleteConversation 
} from "@/services/legalApi";
import { chatWithAI, uploadDocuments } from "@/services/legalChatbotApi";
import { Conversation as ApiConversation } from "@/services/legalApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface CaseContext {
    parties: string;
    bench: string;
    precedents: Array<{ ref: string; match: number; year: string }>;
    confidence: number;
    status: 'empty' | 'identified' | 'detecting';
}

const Ask = () => {
  const { mode } = useExperienceMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicMode = location.pathname.startsWith('/public');
  const { toast } = useToast();
  
  // States
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [researchResult, setResearchResult] = useState<LegalResearchResponse | null>(null);
  const [responseMode, setResponseMode] = useState<string>(!isPublicMode ? "Hybrid (Smart)" : "Layman Explanation");
  const [files, setFiles] = useState<Array<{ name: string; file: File }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ApiConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showStrategicAnalysis, setShowStrategicAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Context
  const [caseContext, setCaseContext] = useState<CaseContext>({
      parties: "No identity extracted",
      bench: "Context awaited",
      precedents: [],
      confidence: 0,
      status: 'empty'
  });

  // Effects
  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (currentConversation) loadConversationMessages(currentConversation.id); }, [currentConversation]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Context heuristic
  useEffect(() => {
    if (messages.length > 0) {
        const lastMsg = [...messages].reverse().find(m => m.role === "user")?.content.toLowerCase() || "";
        if (lastMsg.length > 10) {
            setCaseContext(prev => ({
                ...prev,
                parties: "Auto-identifying...",
                status: 'detecting',
                confidence: 45
            }));
            
            // Mocking intelligence
            if (lastMsg.includes("vs") || lastMsg.includes("v.")) {
                setTimeout(() => {
                    setCaseContext({
                        parties: "Dynamic Case Identity Found",
                        bench: "Estimated Jurisdiction",
                        precedents: [{ ref: "PRE-2024-X", match: 91, year: "2024" }],
                        confidence: 88,
                        status: 'identified'
                    });
                }, 2000);
            }
        }
    }
  }, [messages]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  const loadConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res);
      if (res.length > 0 && !currentConversation) setCurrentConversation(res[0]);
      else if (res.length === 0) createNewConversation();
    } catch (e) { console.error(e); }
  };

  const loadConversationMessages = async (id: string) => {
    try {
      const res = await getConversation(id);
      setMessages(res.history.map((m, i) => ({ id: `${id}-${i}`, role: m.role as any, content: m.content, timestamp: new Date() })));
    } catch (e) { console.error(e); }
  };

  const createNewConversation = async () => {
    try {
      const newConv = await createConversation("General Chat");
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || isLoading) return;

    try {
      setIsLoading(true);
      setIsTyping(true);
      const userTxt = input.trim();
      const userMsg: Message = { id: Date.now().toString(), role: "user", content: userTxt, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput("");

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => formData.append('file', f.file));
        await uploadDocuments(formData);
        setFiles([]);
      }

      const res = await chatWithAI(userTxt, responseMode as any, currentConversation?.id || "default");
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: "assistant", content: res.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);

    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); setIsTyping(false); }
  };

  const formatLegalContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const t = line.trim();
      if (!t) return <div key={i} className="h-2" />;
      if (t.startsWith('#') || (t.toUpperCase() === t && t.length > 5)) return <h3 key={i} className="text-primary font-bold mt-4 mb-2 flex items-center gap-2"><Scale className="h-4 w-4" />{t.replace(/^#+\s/, '')}</h3>;
      if (t.match(/^[\*\-\d\+]\s/)) return <li key={i} className="ml-4 list-disc text-sm mb-1">{t.replace(/^.+?\s/, '')}</li>;
      return <p key={i} className="text-sm leading-relaxed mb-3">{t}</p>;
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0c10] text-gray-100 font-outfit overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.03)_0%,_transparent_50%)] pointer-events-none" />
      
      {!isSidebarOpen && (
        <Button variant="outline" size="icon" className="fixed top-20 right-4 z-50 bg-card/80 border-primary/20" onClick={() => setIsSidebarOpen(true)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <AnimatePresence mode="wait">
        {showStrategicAnalysis ? (
          <motion.div key="strategic" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="flex flex-1 w-full relative z-10">
            {/* Context Sidebar */}
            <div className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-2xl hidden lg:flex flex-col">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-bold">INTELLIGENCE</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Label className="text-[9px] uppercase font-black text-gray-500">PARTIES IDENTIFIED</Label>
                    <p className={cn("text-xs font-bold mt-2", caseContext.status === 'empty' ? "text-gray-600 italic" : "text-white")}>{caseContext.parties}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Label className="text-[9px] uppercase font-black text-gray-500">BENCH / JURISDICTION</Label>
                    <p className={cn("text-xs font-bold mt-2", caseContext.status === 'empty' ? "text-gray-600 italic" : "text-white")}>{caseContext.bench}</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-8">
                 <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><History className="h-3 w-3" /> PRECENDENTS</h4>
                   <div className="space-y-3">
                     {caseContext.precedents.map((p, i) => (
                       <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5">
                         <div className="flex justify-between text-[10px] font-bold mb-2"><span>{p.ref}</span><span>{p.match}%</span></div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${p.match}%` }} /></div>
                       </div>
                     ))}
                   </div>
                 </div>
              </ScrollArea>
              <div className="p-6 border-t border-white/5">
                <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest" onClick={() => setShowStrategicAnalysis(false)}><Minimize2 className="h-3 w-3 mr-2" /> EXIT TERMINAL</Button>
              </div>
            </div>
            
            {/* Strategic Center */}
            <div className="flex-1 flex flex-col bg-black/20">
               <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
                 <div className="flex items-center gap-3"><Brain className="h-6 w-6 text-primary shadow-glow" /><h2 className="text-xl font-black">STRATEGIC BRIEF</h2></div>
                 <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-3 py-1">SIGNAL STRENGTH: {caseContext.confidence}%</Badge>
               </header>
               <ScrollArea className="flex-1 p-10">
                 <div className="max-w-4xl mx-auto space-y-10 pb-32">
                   {messages.map((m) => (
                     <div key={m.id} className={cn("animate-in fade-in slide-in-from-bottom-2", m.role === 'user' ? "text-right" : "text-left")}>
                       <div className={cn("inline-block p-8 rounded-3xl border", m.role === 'user' ? "bg-primary/10 border-primary/30 rounded-tr-none text-left" : "bg-white/5 border-white/10 backdrop-blur-md rounded-tl-none")}>
                         {m.role === 'assistant' ? formatLegalContent(m.content) : m.content}
                       </div>
                     </div>
                   ))}
                   <div ref={messagesEndRef} />
                 </div>
               </ScrollArea>
               <div className="p-8 sticky bottom-0 bg-gradient-to-t from-[#0a0c10] to-transparent">
                 <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3 p-3 bg-white/5 border border-primary/20 rounded-full backdrop-blur-xl">
                   <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Engage Intelligence Analysis..." className="min-h-[50px] max-h-[150px] resize-none flex-1 border-0 focus-visible:ring-0 text-sm py-4" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} />
                   <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-primary shadow-glow" disabled={isLoading || !input.trim()}><Send className="h-5 w-5" /></Button>
                 </form>
               </div>
            </div>
          </motion.div>
        ) : (
          /* Standard View */
          <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col" style={{ marginRight: isSidebarOpen ? 380 : 0 }}>
             <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between bg-[#0a0c10]/80 backdrop-blur-md">
               <div className="flex items-center gap-3"><Scale className="h-6 w-6 text-primary shadow-glow" /><h1 className="text-lg font-black tracking-tight">RESEARCH HUB</h1></div>
             </header>
             <ScrollArea className="flex-1">
               <div className="max-w-5xl mx-auto px-10 py-20 min-h-full">
                 {messages.length === 0 ? (
                   <div className="text-center space-y-12 py-20">
                     <div className="h-20 w-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20"><Brain className="h-10 w-10 text-primary" /></div>
                     <h2 className="text-5xl font-black tracking-tighter">How can I assist your case?</h2>
                     <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {quickSuggestions.map((s, i) => (
                          <Button key={i} variant="outline" className="h-20 rounded-3xl border-white/5 hover:border-primary/20 bg-white/[0.02]" onClick={() => setInput(s)}>{s}</Button>
                        ))}
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-10 pb-40">
                     {messages.map((m) => (
                       <div key={m.id} className={cn("flex gap-6", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                         <Avatar className="h-12 w-12 ring-2 ring-primary/10"><AvatarFallback className="bg-primary/5 text-primary">{m.role === 'user' ? <User /> : <Bot />}</AvatarFallback></Avatar>
                         <div className={cn("max-w-[75%] p-6 rounded-3xl text-sm shadow-xl", m.role === 'user' ? "bg-primary/10 border-primary/20 rounded-tr-none text-white" : "bg-white/5 border-white/10 rounded-tl-none")}>
                            {m.role === 'assistant' ? formatLegalContent(m.content) : m.content}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
                 <div ref={messagesEndRef} />
               </div>
             </ScrollArea>
             <div className="p-10 border-t border-white/5">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3 p-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
                   <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-12 w-12 rounded-full hover:bg-white/5"><Paperclip className="h-5 w-5 text-gray-500" /></Button>
                   <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type legal query..." className="min-h-[50px] max-h-[200px] resize-none flex-1 border-0 focus-visible:ring-0 py-4" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} />
                   <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles(prev => [...prev, { name: f.name, file: f }]); }} className="hidden" />
                   <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-primary" disabled={isLoading || (!input.trim() && files.length === 0)}>{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</Button>
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Shared Component Style) */}
      {isSidebarOpen && (
        <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="fixed right-0 top-0 bottom-0 w-[380px] bg-[#0d0f14] border-l border-white/5 flex flex-col z-40">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 italic">Control Node</h2>
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}><ChevronRight /></Button>
           </div>
           <ScrollArea className="flex-1 p-8">
             <div className="space-y-10">
                <div onClick={() => setShowStrategicAnalysis(true)} className="p-1 rounded-3xl bg-gradient-to-br from-primary to-emerald-500 cursor-pointer shadow-glow-primary overflow-hidden">
                   <div className="bg-[#0d0f14] p-6 flex flex-col gap-4">
                     <Zap className="h-6 w-6 text-primary animate-pulse" />
                     <h4 className="text-xs font-black uppercase text-white">Strategic View</h4>
                     <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                   </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Archive</Label>
                  {conversations.map(c => (
                    <div key={c.id} onClick={() => setCurrentConversation(c)} className={cn("p-4 rounded-xl cursor-pointer text-xs border transition-all", currentConversation?.id === c.id ? "bg-primary/10 border-primary/20" : "hover:bg-white/5 border-transparent")}>
                      <p className="font-bold truncate text-gray-200">{c.title || "Nexus Session"}</p>
                    </div>
                  ))}
                </div>
             </div>
           </ScrollArea>
        </motion.div>
      )}
    </div>
  );
};

const quickSuggestions = ["Rights in tenancy", "Divorce filing process", "Statute of limitations", "Will creation guide"];

export default Ask;