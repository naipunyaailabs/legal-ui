import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Gavel,
  FileSearch,
  Shield,
  Calendar,
  BarChart3,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const FeatureInteract = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            <FileText className="h-4 w-4 mr-2" />
            Document Analysis Tool
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Document Analysis
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Upload and analyze legal documents with AI insights. Extract key information, 
            detect risks, and understand your obligations with our powerful document 
            analysis tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
              <Link to="/public/interact">
                Try INTERACT Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link to="/features">
                View All Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Details */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">How INTERACT Works</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our document analysis tool extracts key information, detects risks, and 
              provides actionable insights from your legal documents. From contract 
              review to compliance checking, INTERACT helps you understand what matters 
              most in your legal paperwork.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Clause Detection</h3>
                  <p className="text-muted-foreground">
                    Automatically identify and extract important clauses from contracts 
                    and legal documents, organized by section for easy review.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
                  <p className="text-muted-foreground">
                    Identify potential legal and financial risks in your documents with 
                    severity ratings and recommended mitigation strategies.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Chronology Building</h3>
                  <p className="text-muted-foreground">
                    Extract important dates, deadlines, and events from your documents 
                    to help you stay organized and never miss a critical date.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-2xl p-8">
            <Card className="border border-border bg-card rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Example Document Analysis
                </CardTitle>
                <CardDescription>
                  See how INTERACT analyzes legal documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="font-medium">Document Type:</p>
                  <p className="text-muted-foreground mt-1">
                    Employment Contract
                  </p>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium">Key Findings:</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• 12-month notice period for termination</li>
                    <li>• Non-compete clause covering 50-mile radius</li>
                    <li>• Confidentiality obligations extend 2 years post-employment</li>
                    <li>• Risk: Non-compete may be unenforceable in California</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analysis Types */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Multiple Analysis Types</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            INTERACT offers specialized analysis tools for different legal needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Document Summary</CardTitle>
              <CardDescription>
                Get a comprehensive overview of key points and obligations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Extract the most important information from lengthy legal documents 
                in a concise, easy-to-understand format.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSearch className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Clause Analysis</CardTitle>
              <CardDescription>
                Identify and categorize important contractual provisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically detect and organize key clauses like termination, 
                confidentiality, and indemnification provisions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Identify potential legal and financial risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flag problematic clauses, ambiguous language, and potential 
                liabilities with severity ratings and mitigation suggestions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Chronology Builder</CardTitle>
              <CardDescription>
                Extract important dates and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically identify and organize key dates, notice periods, 
                and expiration dates to help you stay organized.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Document Classification</CardTitle>
              <CardDescription>
                Automatically categorize documents by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identify document types and subjects to help organize your 
                legal library and ensure proper handling.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Document Chat</CardTitle>
              <CardDescription>
                Ask questions about specific documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Have a conversation with our AI about your uploaded documents 
                to get specific answers to your questions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dual Mode Comparison */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Designed for Everyone</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The same powerful technology, tailored for different expertise levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Public Mode */}
          <Card className="border border-border rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Public Mode
              </CardTitle>
              <CardDescription>
                For general users who need simple document insights
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Document summarization</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Key point highlighting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Plain-language explanations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Risk flagging with simple warnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Actionable next steps</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Lawyer Mode */}
          <Card className="border border-border rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                Lawyer Mode
              </CardTitle>
              <CardDescription>
                For legal professionals who need advanced analysis tools
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Advanced clause detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Risk scoring with mitigation suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Compliance checking against regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Side-by-side document comparison</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Exportable analysis reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Analyze Your Documents?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Upload your legal documents and get AI-powered insights in seconds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
                <Link to="/public/interact">
                  Try INTERACT Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8" asChild>
                <Link to="/features-overview">
                  Explore All Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureInteract;