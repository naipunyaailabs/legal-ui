import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Search, FileText, FileEdit, Sparkles, Shield, Zap, CheckCircle2, ArrowRight, Scale, BookOpen, MessageCircle, Users, Briefcase, Play, Upload, File as FileIcon, Bot, User, Send, Paperclip, Settings, RefreshCw, Save, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { useAuth } from "@/hooks/useAuth";
import { Highlighter } from "@/components/ui/highlighter";
import heroImage from "@/assets/hero-legal-ai.jpg";

const Landing = () => {
  const { mode, setMode } = useExperienceMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleModeToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMode(mode === 'lawyer' ? 'public' : 'lawyer');
      setIsAnimating(false);
    }, 300);
  };

  const handleOpenAssistant = () => {
    if (user) {
      navigate('/dashboard/assistant');
    } else {
      navigate('/public/assistant');
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      {/* Hero Section */}
      <section className="container pt-32 pb-24 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Empowering Legal Intelligence with AI</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Legal Practice with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered Intelligence
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Legal AI combines cutting-edge AI with legal expertise to deliver instant research,
              intelligent document analysis, and automated drafting for modern law firms. Our platform
              seamlessly adapts to your needs with both <span className="text-3xl font-bold"><Highlighter action="underline" color="hsl(210, 100%, 70%)" padding={2}>lawyer</Highlighter></span>  and <span className="text-3xl font-bold"> <Highlighter action="underline" color="hsl(180, 100%, 33%)" padding={2}>public</Highlighter></span> views.
            </p>

            <div className="pt-6 space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Seamless Experience for All Users</h3>
                <p className="text-muted-foreground">
                  Access both professional legal tools and easy-to-understand summaries within the same platform.
                  Switch between <Highlighter action="underline" color="hsl(210, 100%, 70%)" padding={2}>Lawyer</Highlighter> and <Highlighter action="underline" color="hsl(180, 100%, 33%)" padding={2}>Public</Highlighter> modes anytime based on your current task or preference.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                onClick={handleOpenAssistant}
              >
                Open Legal Assistant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/features-overview">
                <Button size="lg" variant="outline" className="px-8">
                  Explore Features
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">14-day free trial</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl">
              <img
                src={heroImage}
                alt="Legal AI Platform Interface"
                className={`w-full h-auto object-cover transition-all duration-500 ${isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
                  }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 relative space-y-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Three Powerful Modules, Infinite Possibilities
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to revolutionize your legal workflow
          </p>
        </div>

        {/* ASK Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* ASK Animation Card */}
          <Card className="h-[400px] w-full border border-border bg-gradient-to-br from-teal-50/50 to-blue-50/50 shadow-sm rounded-2xl flex items-center justify-center overflow-hidden relative group">
            <div className="relative w-[320px] h-[350px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col scale-90">
              {/* Mini Header */}
              <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-gray-700">Legal Assistant</span>
                </div>
                <Settings className="h-3 w-3 text-gray-400" />
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 space-y-4 bg-gray-50/50 relative">
                {/* User Message */}
                <div className="flex justify-end animate-[chat-user_5s_infinite]">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-3 py-2 text-xs max-w-[80%] shadow-sm">
                    What are the elements of negligence?
                  </div>
                </div>

                {/* Processing Indicator */}
                <div className="flex gap-2 animate-[chat-loader_5s_infinite]">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm flex items-center gap-1">
                    <Bot className="h-3 w-3 text-primary" />
                    <div className="flex gap-1">
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce" />
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce delay-75" />
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>

                {/* AI Response - IRAC */}
                <div className="flex gap-2 animate-[chat-bot_5s_infinite]">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[90%] text-[10px] space-y-2">
                    <div className="flex items-center gap-1 text-primary font-semibold border-b border-gray-50 pb-1">
                      <Sparkles className="h-3 w-3" />
                      <span>IRAC Analysis</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="animate-[type-text_5s_infinite]" style={{ animationDelay: '0s' }}>
                        <span className="font-bold text-gray-800">ISSUE:</span>
                        <span className="text-gray-600"> Whether the defendant owed a duty of care...</span>
                      </div>
                      <div className="animate-[type-text_5s_infinite]" style={{ animationDelay: '0.5s' }}>
                        <span className="font-bold text-gray-800">RULE:</span>
                        <span className="text-gray-600"> Negligence requires duty, breach, causation...</span>
                      </div>
                      <div className="animate-[type-text_5s_infinite]" style={{ animationDelay: '1.0s' }}>
                        <span className="font-bold text-gray-800">ANALYSIS:</span>
                        <span className="text-gray-600"> The defendant failed to act as a reasonable...</span>
                      </div>
                      <div className="animate-[type-text_5s_infinite]" style={{ animationDelay: '1.5s' }}>
                        <span className="font-bold text-gray-800">CONCLUSION:</span>
                        <span className="text-gray-600"> Likely liable for damages.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg border border-gray-200 h-8 flex items-center px-3 justify-between">
                  <span className="text-xs text-gray-400">Ask a follow-up...</span>
                  <Send className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Floating Feature Badges */}
            <div className="absolute top-10 right-10 bg-white/90 backdrop-blur shadow-md px-2 py-1 rounded-md text-[10px] font-medium text-primary animate-[float-badge_5s_infinite]" style={{ animationDelay: '0.5s' }}>
              Case Law Citations
            </div>
            <div className="absolute bottom-20 left-10 bg-white/90 backdrop-blur shadow-md px-2 py-1 rounded-md text-[10px] font-medium text-primary animate-[float-badge_5s_infinite]" style={{ animationDelay: '1.0s' }}>
              Confidence Score: 92%
            </div>
          </Card>

          {/* Text Card */}
          <Card className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg h-full">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">ASK</h3>
                <p className="text-muted-foreground">
                  Smart Legal Research with IRAC-formatted responses. Get comprehensive analysis with
                  jurisdiction-specific insights and confidence scoring.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "IRAC Format Analysis",
                  "Multi-jurisdiction Support",
                  "Case Law Citations",
                  "Confidence Scoring"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link to="/ask-info">
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent">
                    Know More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INTERACT Animation Card */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <Card className="h-[400px] w-full border border-border bg-gradient-to-br from-blue-50/50 to-teal-50/50 shadow-sm rounded-2xl flex items-center justify-center overflow-hidden relative order-1 lg:order-2 group">
            <div className="relative w-[320px] h-[350px] flex flex-col gap-4 scale-90">
              {/* Upload Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 absolute inset-0 z-10 animate-[cycle-upload_5s_infinite]">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-bold text-gray-800">Upload Documents</span>
                </div>
                <div className="border-2 border-dashed border-teal-200 bg-teal-50/50 rounded-lg h-48 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-2 z-10">
                    <div className="bg-white p-2 rounded-full shadow-sm inline-block">
                      <Upload className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-xs text-gray-500">Drop PDF here</p>
                  </div>
                  {/* Floating PDF Icon */}
                  <div className="absolute bottom-[-40px] animate-[fly-in-loop_5s_infinite]">
                    <FileText className="h-10 w-10 text-red-500 drop-shadow-md" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md opacity-0 animate-[pulse-fade-loop_5s_infinite]">
                    Analyzing...
                  </div>
                </div>
              </div>

              {/* Results Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-0 absolute inset-0 z-0 flex flex-col overflow-hidden animate-[cycle-result_5s_infinite]">
                <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">Analysis Result</span>
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                    <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Summary Section */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-primary flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Summary
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-100 rounded w-full animate-[shimmer_2s_infinite]" />
                      <div className="h-2 bg-gray-100 rounded w-[90%] animate-[shimmer_2s_infinite]" />
                      <div className="h-2 bg-gray-100 rounded w-[95%] animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>

                  {/* Sources Section */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-primary flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Sources
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                      <FileText className="h-3 w-3 text-red-500" />
                      <span className="text-[10px] text-gray-600">Contract_v1.pdf</span>
                      <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />
                    </div>
                  </div>

                  {/* Key Clauses Badges */}
                  <div className="flex gap-2 pt-2">
                    <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Liability Risk</span>
                    <span className="text-[9px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100">Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Text Card */}
          <Card className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg h-full order-2 lg:order-1">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">INTERACT</h3>
                <p className="text-muted-foreground">
                  Advanced Document Analysis. Upload contracts, case files, or legal briefs to
                  extract key information, identify risks, and summarize complex content.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Risk Detection",
                  "Clause Extraction",
                  "Document Summarization",
                  "Compliance Checking"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link to="/interact-info">
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent">
                    Know More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DRAFT Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* DRAFT Animation Card */}
          <Card className="h-[400px] w-full border border-border bg-gradient-to-br from-purple-50/50 to-blue-50/50 shadow-sm rounded-2xl flex items-center justify-center overflow-hidden relative group">
            <div className="relative w-[320px] h-[350px] scale-90">
              {/* Input Form */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 absolute inset-0 z-10 flex flex-col gap-4 animate-[cycle-form_5s_infinite]">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FileEdit className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-bold text-gray-800">Draft Document</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium">Document Type</div>
                    <div className="h-8 border border-gray-200 rounded-md flex items-center px-2 text-xs text-gray-700 bg-gray-50">
                      Non-Disclosure Agreement (NDA)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium">Jurisdiction</div>
                    <div className="h-8 border border-gray-200 rounded-md flex items-center px-2 text-xs text-gray-700 bg-gray-50">
                      India
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium">Requirements</div>
                    <div className="h-16 border border-gray-200 rounded-md p-2 text-[10px] text-gray-600 bg-gray-50">
                      Draft a mutual NDA for a partnership discussion...
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="w-full bg-purple-600 text-white h-8 rounded-md flex items-center justify-center gap-2 text-xs font-medium shadow-sm animate-[button-press-loop_5s_infinite]">
                    <Sparkles className="h-3 w-3" /> Generate Draft
                  </div>
                </div>
              </div>

              {/* Generated Doc */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-0 absolute inset-0 z-0 flex flex-col animate-[cycle-doc_5s_infinite]">
                <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Generated
                  </span>
                  <div className="flex gap-1">
                    <div className="p-1 hover:bg-gray-200 rounded"><Save className="h-3 w-3 text-gray-500" /></div>
                    <div className="p-1 hover:bg-gray-200 rounded"><Download className="h-3 w-3 text-gray-500" /></div>
                  </div>
                </div>

                <div className="p-6 flex-1 bg-white overflow-hidden relative">
                  <div className="text-center mb-4">
                    <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">Non-Disclosure Agreement</div>
                  </div>
                  <div className="space-y-2 text-[8px] text-gray-600 leading-relaxed font-serif">
                    <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '0s' }}>
                      This Non-Disclosure Agreement (the "Agreement") is entered into by and between...
                    </div>
                    <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '0.5s' }}>
                      1. <span className="font-bold">Confidential Information</span>. The parties agree to maintain strict confidentiality...
                    </div>
                    <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '1.0s' }}>
                      2. <span className="font-bold">Term</span>. This Agreement shall remain in effect for a period of 3 years...
                    </div>
                    <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '1.5s' }}>
                      3. <span className="font-bold">Governing Law</span>. This Agreement shall be governed by the laws of India.
                    </div>
                  </div>

                  {/* Signature Lines */}
                  <div className="mt-8 flex justify-between">
                    <div className="w-20 border-t border-gray-300 pt-1 text-[8px] text-gray-400">Disclosing Party</div>
                    <div className="w-20 border-t border-gray-300 pt-1 text-[8px] text-gray-400">Receiving Party</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Text Card */}
          <Card className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg h-full">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileEdit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">DRAFT</h3>
                <p className="text-muted-foreground">
                  AI-Powered Document Generation. Create professional legal documents with
                  intelligent templates, version control, and collaborative editing.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Smart Templates",
                  "Version Control",
                  "Collaborative Editing",
                  "Custom Clauses"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link to="/draft-info">
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent">
                    Know More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-24 relative">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Legal Professionals Trust Legal AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of legal work with our enterprise-grade platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level encryption and compliance with legal industry standards"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Get answers to complex legal questions in seconds, not hours"
            },
            {
              icon: BookOpen,
              title: "Vast Legal Knowledge",
              description: "Trained on millions of legal documents, cases, and regulations"
            },
            {
              icon: Scale,
              title: "Precision Accuracy",
              description: "99.2% accuracy rate verified by legal professionals"
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="border border-border bg-card rounded-xl p-6 hover:shadow-md transition-shadow">
                <CardContent className="p-0 space-y-4 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 relative">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Join hundreds of law firms already using Legal AI to work smarter, faster, and more efficiently.
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-lg hover:shadow-xl transition-shadow px-8"
                onClick={handleOpenAssistant}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/features-overview">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border relative">
        <div className="container py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Legal AI</span>
              </div>
              <p className="text-muted-foreground">
                Empowering legal professionals with AI-powered tools for research, analysis, and drafting.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Product</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/features-overview" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Solutions</a></li>
                <li><a href="howitworks" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Resources</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Company</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>© 2025 Legal AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes chat-user {
          0%, 5% { opacity: 0; transform: translateX(20px); }
          10%, 90% { opacity: 1; transform: translateX(0); }
          95%, 100% { opacity: 0; transform: translateX(0); }
        }
        @keyframes chat-loader {
          0%, 10% { opacity: 0; display: none; }
          15%, 35% { opacity: 1; display: flex; }
          40%, 100% { opacity: 0; display: none; }
        }
        @keyframes chat-bot {
          0%, 35% { opacity: 0; transform: translateX(-20px); }
          40%, 90% { opacity: 1; transform: translateX(0); }
          95%, 100% { opacity: 0; transform: translateX(0); }
        }
        @keyframes type-text {
          0%, 40% { opacity: 0; transform: translateY(5px); }
          45%, 90% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; transform: translateY(0); }
        }
        @keyframes cycle-upload {
          0%, 40% { opacity: 1; transform: translateY(0); z-index: 10; }
          45%, 90% { opacity: 0; transform: translateY(-20px); z-index: 0; }
          95%, 100% { opacity: 1; transform: translateY(0); z-index: 10; }
        }
        @keyframes cycle-result {
          0%, 40% { opacity: 0; transform: scale(0.95); z-index: 0; }
          45%, 90% { opacity: 1; transform: scale(1); z-index: 10; }
          95%, 100% { opacity: 0; transform: scale(0.95); z-index: 0; }
        }
        @keyframes fly-in-loop {
          0%, 10% { transform: translateY(0) scale(0.5); opacity: 0; }
          20%, 40% { transform: translateY(-80px) scale(1); opacity: 1; }
          45%, 100% { transform: translateY(-80px) scale(1); opacity: 0; }
        }
        @keyframes pulse-fade-loop {
          0%, 25% { opacity: 0; }
          30%, 40% { opacity: 1; transform: scale(1.05); }
          45%, 100% { opacity: 0; }
        }
        @keyframes shimmer { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        @keyframes cycle-form {
          0%, 40% { opacity: 1; transform: translateX(0); z-index: 10; }
          45%, 90% { opacity: 0; transform: translateX(-50px); z-index: 0; }
          95%, 100% { opacity: 1; transform: translateX(0); z-index: 10; }
        }
        @keyframes cycle-doc {
          0%, 40% { opacity: 0; transform: translateX(50px); z-index: 0; }
          45%, 90% { opacity: 1; transform: translateX(0); z-index: 10; }
          95%, 100% { opacity: 0; transform: translateX(50px); z-index: 0; }
        }
        @keyframes button-press-loop {
          0%, 35% { transform: scale(1); }
          38% { transform: scale(0.95); }
          40%, 100% { transform: scale(1); }
        }
        @keyframes type-line-loop {
          0%, 45% { opacity: 0; transform: translateY(5px); }
          50%, 90% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; transform: translateY(5px); }
        }
        @keyframes float-badge {
          0%, 45% { opacity: 0; transform: translateY(10px); }
          50%, 90% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;