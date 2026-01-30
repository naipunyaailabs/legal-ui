import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  Search, 
  FileText, 
  FileEdit, 
  Brain, 
  Users, 
  Gavel, 
  BookOpen, 
  Shield, 
  Zap, 
  Database, 
  Cpu, 
  ArrowRight, 
  CheckCircle2,
  MessageCircle,
  FileSearch,
  FilePenLine,
  ScrollText,
  Lightbulb,
  Target,
  Layers,
  Workflow
} from "lucide-react";
import { Link } from "react-router-dom";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Navbar } from "@/components/Navbar";

const HowItWorks = () => {
  const { mode, setMode } = useExperienceMode();
  const [activeMode, setActiveMode] = useState<"lawyer" | "public">(mode as "lawyer" | "public");

  // Sync activeMode with context mode
  useEffect(() => {
    setActiveMode(mode as "lawyer" | "public");
  }, [mode]);

  const toggleModeView = (mode: "lawyer" | "public") => {
    setActiveMode(mode);
    setMode(mode);
  };

  // Step data for both modes
  const stepData = {
    public: [
      {
        icon: MessageCircle,
        title: "Ask a Legal Question",
        description: "Enter your question in simple language — no legal jargon needed.",
        details: "Our AI understands everyday language and translates it into precise legal queries. Just ask as you would a friend - we'll handle the legal complexity.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: Lightbulb,
        title: "AI Understands & Simplifies",
        description: "The system interprets your query and finds reliable legal information.",
        details: "We search across multiple legal databases to find the most relevant information and simplify it for everyday understanding.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: FilePenLine,
        title: "Get Plain-Language Answers",
        description: "Receive clear explanations you can easily understand and act upon.",
        details: "Complex legal concepts are broken down into digestible explanations with practical guidance for your situation.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: FileText,
        title: "Create or Review Documents",
        description: "Generate simple legal documents or review existing ones with guided assistance.",
        details: "Create basic legal documents or analyze existing ones with step-by-step guidance and plain-language explanations.",
        color: "bg-primary/10 text-primary"
      }
    ],
    lawyer: [
      {
        icon: Target,
        title: "Define Advanced Legal Query",
        description: "Specify jurisdiction, legal precedents, and detailed parameters for complex research.",
        details: "Define precise parameters for complex legal research with jurisdictional specifications, citation requirements, and precedent preferences.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: Database,
        title: "RAG-Based Legal Research",
        description: "AI performs retrieval-augmented research using verified legal databases and case law.",
        details: "Our system accesses verified legal databases and case law for authoritative information, cross-referencing multiple sources for accuracy.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: ScrollText,
        title: "Generate Structured Legal Response",
        description: "Receive detailed answers in IRAC format with citations, precedents, and legal reasoning.",
        details: "Get professionally formatted responses with proper legal citations, case law references, and structured legal analysis following IRAC methodology.",
        color: "bg-primary/10 text-primary"
      },
      {
        icon: Layers,
        title: "Advanced Document Drafting",
        description: "Create, compare, and refine complex legal documents with professional-grade tools.",
        details: "Professional-grade document creation with clause libraries, precedent matching, version control, and collaborative editing features.",
        color: "bg-primary/10 text-primary"
      }
    ]
  };

  // Get current steps based on active mode
  const currentSteps = activeMode === "lawyer" ? stepData.lawyer : stepData.public;

  // Behind the scenes data
  const techFlow = [
    {
      step: "Input Processing",
      description: "User query captured via FastAPI and processed by LangChain",
      icon: Cpu
    },
    {
      step: "Semantic Retrieval",
      description: "Query sent to Qdrant for retrieval-augmented generation",
      icon: Database
    },
    {
      step: "AI Generation",
      description: "Groq LLM generates structured response with citations",
      icon: Brain
    },
    {
      step: "Response Delivery",
      description: "Result returned to user interface in chosen mode",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container pt-32 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-4 py-2 rounded-full">
            {activeMode === "lawyer" ? (
              <span className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                For Legal Professionals
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                For General Users
              </span>
            )}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Understand the Law — Smarter, Faster, and Easier
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you're a lawyer or an individual, our AI adapts to your needs.
          </p>
          
          {/* Mode Toggle */}
          <div>
            <Tabs value={activeMode} onValueChange={(value) => toggleModeView(value as "lawyer" | "public")} className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto p-1 bg-muted rounded-lg h-auto">
                <TabsTrigger 
                  value="lawyer" 
                  className="flex items-center justify-center gap-2 py-2 md:py-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Gavel className="w-4 h-4" />
                  <span className="hidden sm:inline">For Lawyers</span>
                  <span className="sm:hidden">Lawyers</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="public" 
                  className="flex items-center justify-center gap-2 py-2 md:py-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">For General Users</span>
                  <span className="sm:hidden">General</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-sm text-muted-foreground mt-3">
              Two experiences. One intelligent platform.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How {activeMode === "lawyer" ? "Legal Professionals" : "General Users"} Use Legal AId
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform guides you through a seamless process from question to answer
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="text-primary font-bold">0{index + 1}</span>
                    {step.title}
                  </CardTitle>
                  <CardDescription>
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Mode Comparison */}
      <section className="container py-24 bg-muted/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Same Platform, Different Experiences
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Whether you're a legal professional or a general user, our platform adapts to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Normal Mode */}
          <Card className="border border-border bg-card rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    General Users
                    <Badge variant="secondary" className="rounded-full px-3 py-1">Normal Mode</Badge>
                  </CardTitle>
                </div>
              </div>
              <CardDescription>
                Designed for individuals seeking clear, understandable legal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Plain language explanations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Guided document creation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Simple question format</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Basic legal guidance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Lawyer Mode */}
          <Card className="border border-border bg-card rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    Legal Professionals
                    <Badge className="rounded-full px-3 py-1 bg-primary text-primary-foreground">Advanced Mode</Badge>
                  </CardTitle>
                </div>
              </div>
              <CardDescription>
                Designed for lawyers and legal professionals requiring detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Professional legal terminology</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Case law citations and precedents</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Advanced document drafting tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>IRAC format responses</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Behind the Scenes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our advanced technology stack powers the intelligent legal research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFlow.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border border-border bg-card rounded-2xl text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    Step 0{index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Experience Legal Intelligence?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Switch anytime. One platform, two tailored experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                variant="secondary" 
                className="shadow-lg hover:shadow-xl transition-shadow px-8"
                asChild
              >
                <Link to="/auth">
                  Try as General User
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8"
                asChild
              >
                <Link to="/auth">
                  Try as Lawyer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;