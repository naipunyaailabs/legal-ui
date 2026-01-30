import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Search, FileText, FileEdit, Brain, Users, Gavel, BookOpen, Shield, Zap, Database, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Features = () => {
  const [activeMode, setActiveMode] = useState<"lawyer" | "public">("lawyer");

  const toggleMode = () => {
    setActiveMode(prev => prev === "lawyer" ? "public" : "lawyer");
  };

  // Core Features Data
  const coreFeatures = [
    {
      icon: Search,
      title: "AI-Powered Legal Research",
      description: "ASK transforms complex legal queries into comprehensive research with citations and jurisdictional insights.",
      features: [
        "Natural language legal queries",
        "IRAC structured reasoning",
        "Case law citations",
        "Multi-jurisdiction support"
      ],
      link: "/feature/ask"
    },
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description: "INTERACT extracts key information, detects risks, and provides actionable insights from legal documents.",
      features: [
        "Clause detection and extraction",
        "Risk assessment",
        "Compliance checking",
        "Document comparison"
      ],
      link: "/feature/interact"
    },
    {
      icon: FileEdit,
      title: "Intelligent Document Drafting",
      description: "DRAFT generates professional legal documents with customizable templates and version control.",
      features: [
        "Smart legal templates",
        "Version control",
        "Collaborative editing",
        "Jurisdiction-specific clauses"
      ],
      link: "/feature/draft"
    }
  ];

  // Dual Mode Comparison Data
  const dualModeFeatures = [
    {
      title: "Legal Research (ASK)",
      lawyer: {
        description: "Advanced legal research with IRAC structured reasoning, jurisdiction filters, and confidence scoring.",
        features: [
          "IRAC format analysis",
          "Case law citations with hyperlinks",
          "Multi-jurisdiction support",
          "Confidence scoring with explanations",
          "Legal precedent comparison"
        ]
      },
      public: {
        description: "Plain-language explanations of legal concepts with easy-to-understand summaries.",
        features: [
          "Simple query interface",
          "Plain-language explanations",
          "Key point summaries",
          "Visual legal concept diagrams",
          "Glossary of legal terms"
        ]
      }
    },
    {
      title: "Document Analysis (INTERACT)",
      lawyer: {
        description: "Professional document analysis with clause detection, risk assessment, and compliance checking.",
        features: [
          "Advanced clause detection",
          "Risk scoring with mitigation suggestions",
          "Compliance checking against regulations",
          "Side-by-side document comparison",
          "Exportable analysis reports"
        ]
      },
      public: {
        description: "Easy document summarization and explanation of key points for non-legal professionals.",
        features: [
          "Document summarization",
          "Key point highlighting",
          "Plain-language explanations",
          "Risk flagging with simple warnings",
          "Actionable next steps"
        ]
      }
    },
    {
      title: "Document Drafting (DRAFT)",
      lawyer: {
        description: "Advanced document creation with customizable templates, jurisdiction options, and collaborative features.",
        features: [
          "Customizable legal templates",
          "Jurisdiction-specific clauses",
          "Version control with change tracking",
          "Collaborative editing with comments",
          "Integration with legal databases"
        ]
      },
      public: {
        description: "Simple document creation with guided templates and plain-language explanations.",
        features: [
          "Guided document creation",
          "Plain-language templates",
          "Simple editing tools",
          "Basic formatting options",
          "Download in multiple formats"
        ]
      }
    }
  ];

  // Professional Enhancements Data
  const professionalEnhancements = [
    {
      icon: Database,
      title: "RAG-Based Research Engine",
      description: "Retrieval-Augmented Generation for accurate, up-to-date legal information"
    },
    {
      icon: Shield,
      title: "Role-Based Dashboard",
      description: "Customized interfaces for different user roles and expertise levels"
    },
    {
      icon: Cpu,
      title: "Document Version Comparison",
      description: "Track changes and compare document versions with visual diff tools"
    },
    {
      icon: Zap,
      title: "Real-Time AI Feedback",
      description: "Instant suggestions and refinements as you work"
    },
    {
      icon: Gavel,
      title: "API Health Monitoring",
      description: "Continuous system monitoring and performance analytics"
    },
    {
      icon: Brain,
      title: "Authentication Readiness",
      description: "Secure, enterprise-grade authentication and access controls"
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
            Legal AId Platform Features
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Powering Legal Intelligence for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Advanced tools for professionals. Simplified insights for everyone else.
          </p>
          
          {/* Mode Toggle
          <div className="pt-8">
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as "lawyer" | "public")}>
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                <TabsTrigger value="lawyer" className="flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  For Lawyers
                </TabsTrigger>
                <TabsTrigger value="public" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  For General Users
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div> */}
        </div>
      </section>

      {/* Core Features Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">AI-Powered Legal Intelligence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with legal expertise to transform how you work
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link to={feature.link} key={index}>
                <Card className="border border-border bg-card rounded-2xl hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dual Mode Experience Section */}
      <section className="container py-20 bg-muted/30 rounded-3xl px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Dual-Mode Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The same powerful platform, tailored for different expertise levels
          </p>
        </div>

        <div className="space-y-16">
          {dualModeFeatures.map((feature, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-2xl font-bold text-center">{feature.title}</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Lawyer Mode */}
                <Card className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${activeMode === "lawyer" ? "ring-2 ring-primary" : ""}`}>
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        Lawyer Mode
                      </CardTitle>
                      {activeMode === "lawyer" && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    <CardDescription>{feature.lawyer.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {feature.lawyer.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Public Mode */}
                <Card className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${activeMode === "public" ? "ring-2 ring-primary" : ""}`}>
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Public Mode
                      </CardTitle>
                      {activeMode === "public" && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    <CardDescription>{feature.public.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {feature.public.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Enhancements Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Professional Platform Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade capabilities for modern legal teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalEnhancements.map((enhancement, index) => {
            const Icon = enhancement.icon;
            return (
              <Card key={index} className="border border-border bg-card rounded-xl p-6 hover:shadow-md transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{enhancement.title}</h3>
                    <p className="text-muted-foreground text-sm">{enhancement.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Experience the Future of Legal Work
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Join hundreds of law firms already using Legal AId to work smarter, faster, and more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;