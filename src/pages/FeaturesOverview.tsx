import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  FileText,
  FileEdit,
  Scale,
  BookOpen,
  Users,
  Gavel,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Bot,
  Send,
  Upload,
  Save,
  Download,
  Settings
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const FeaturesOverview = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Feature data
  const features = [
    {
      id: "ask",
      icon: Search,
      title: "Ask Legal Questions",
      shortDesc: "Get answers to your legal questions in simple terms",
      longDesc: "Our AI-powered legal research tool transforms complex legal queries into comprehensive, easy-to-understand answers. Whether you're dealing with contract disputes, employment issues, or regulatory compliance, ASK provides clear guidance tailored to your situation.",
      features: [
        "Plain-language explanations",
        "Step-by-step guidance",
        "Jurisdiction-specific insights",
        "Trusted legal information"
      ],
      benefits: [
        "Save time on legal research",
        "Understand complex concepts easily",
        "Make informed decisions",
        "Access 24/7 legal guidance"
      ],
      publicFeatures: [
        "Simple question interface",
        "Plain-language answers",
        "Key point summaries",
        "Actionable next steps"
      ]
    },
    {
      id: "interact",
      icon: FileText,
      title: "Document Analysis",
      shortDesc: "Upload and analyze legal documents with AI insights",
      longDesc: "INTERACT extracts key information, detects risks, and provides actionable insights from your legal documents. From contract review to compliance checking, our document analysis tools help you understand what matters most in your legal paperwork.",
      features: [
        "Clause detection and extraction",
        "Risk assessment",
        "Compliance checking",
        "Document summarization",
        "Chronology building"
      ],
      benefits: [
        "Identify hidden risks",
        "Understand key obligations",
        "Spot important deadlines",
        "Compare document versions"
      ],
      publicFeatures: [
        "Document summarization",
        "Key point highlighting",
        "Plain-language explanations",
        "Risk flagging with simple warnings"
      ]
    },
    {
      id: "draft",
      icon: FileEdit,
      title: "Document Drafting",
      shortDesc: "Create legal documents with guided templates",
      longDesc: "DRAFT generates professional legal documents with customizable templates and version control. From NDAs to employment contracts, our intelligent drafting tools help you create legally sound documents quickly and easily.",
      features: [
        "Smart legal templates",
        "Jurisdiction-specific clauses",
        "Version control",
        "Collaborative editing",
        "Export in multiple formats"
      ],
      benefits: [
        "Create documents in minutes",
        "Ensure legal compliance",
        "Customize for your needs",
        "Collaborate with others",
        "Track document changes"
      ],
      publicFeatures: [
        "Guided document creation",
        "Plain-language templates",
        "Simple editing tools",
        "Download in multiple formats"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            <Scale className="h-4 w-4 mr-2" />
            Legal AId Features
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Powerful Legal Tools for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Advanced AI-powered tools to help you understand, analyze, and create legal documents
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Explore Our Legal Tools</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three powerful tools designed to make legal work simpler and more efficient
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Dialog key={feature.id} open={activeFeature === feature.id} onOpenChange={(open) => setActiveFeature(open ? feature.id : null)}>
                <DialogTrigger asChild>
                  <Card className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col overflow-hidden group">
                    {/* Animated Header Area */}
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center border-b border-border">

                      {/* ASK Animation */}
                      {feature.id === 'ask' && (
                        <div className="relative w-[320px] h-[350px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col scale-[0.65] origin-center">
                          <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-white">
                            <div className="flex items-center gap-2">
                              <Scale className="h-4 w-4 text-primary" />
                              <span className="text-xs font-bold text-gray-700">Legal Assistant</span>
                            </div>
                            <Settings className="h-3 w-3 text-gray-400" />
                          </div>
                          <div className="flex-1 p-4 space-y-4 bg-gray-50/50 relative">
                            <div className="flex justify-end animate-[chat-user_5s_infinite]">
                              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-3 py-2 text-xs max-w-[80%] shadow-sm">
                                What are the elements of negligence?
                              </div>
                            </div>
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
                          <div className="p-3 bg-white border-t border-gray-100">
                            <div className="bg-gray-50 rounded-lg border border-gray-200 h-8 flex items-center px-3 justify-between">
                              <span className="text-xs text-gray-400">Ask a follow-up...</span>
                              <Send className="h-3 w-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* INTERACT Animation */}
                      {feature.id === 'interact' && (
                        <div className="relative w-[320px] h-[350px] flex flex-col gap-4 scale-[0.65] origin-center">
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
                              <div className="flex gap-2 pt-2">
                                <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Liability Risk</span>
                                <span className="text-[9px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100">Compliant</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DRAFT Animation */}
                      {feature.id === 'draft' && (
                        <div className="relative w-[320px] h-[350px] scale-[0.65] origin-center">
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
                              <div className="mt-8 flex justify-between">
                                <div className="w-20 border-t border-gray-300 pt-1 text-[8px] text-gray-400">Disclosing Party</div>
                                <div className="w-20 border-t border-gray-300 pt-1 text-[8px] text-gray-400">Receiving Party</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.shortDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <p className="text-muted-foreground mb-6 flex-grow text-sm line-clamp-3">{feature.longDesc}</p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Learn More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl flex items-center gap-3">
                      {feature.title}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {feature.longDesc}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        For General Users
                      </h3>
                      <ul className="space-y-2">
                        {feature.publicFeatures.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-2">
                        {feature.benefits.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button asChild className="flex-1">
                      <Link to={`/public/${feature.id}`}>
                        Try {feature.title.split(' ')[0]} Now
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to={`/features#${feature.id}`}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-20 bg-muted/30 rounded-3xl px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How Legal AId Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with legal expertise to transform how you work
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-border bg-card rounded-2xl p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-3">Ask Questions</CardTitle>
            <CardDescription>
              Describe your legal situation in simple terms and get clear, actionable guidance
            </CardDescription>
          </Card>

          <Card className="border border-border bg-card rounded-2xl p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-3">Analyze Documents</CardTitle>
            <CardDescription>
              Upload legal documents to extract key information, detect risks, and understand obligations
            </CardDescription>
          </Card>

          <Card className="border border-border bg-card rounded-2xl p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileEdit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-3">Create Documents</CardTitle>
            <CardDescription>
              Generate professional legal documents with guided templates and AI assistance
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Start Using Legal AId Today
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Experience the future of legal work with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
                <Link to="/public">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8" asChild>
                <Link to="/features">
                  View All Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Styles for animations (reused from Landing.tsx) */}
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
      `}</style>
    </div>
  );
};

export default FeaturesOverview;