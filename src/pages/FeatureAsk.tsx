import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Gavel,
  BookOpen,
  MessageSquare,
  User,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const FeatureAsk = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            <Search className="h-4 w-4 mr-2" />
            Legal Research Tool
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Ask Legal Questions
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Get clear, actionable answers to your legal questions in simple terms.
            Our AI-powered legal research tool transforms complex legal queries into
            comprehensive, easy-to-understand guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
              <Link to="/public/assistant">
                Try ASK Now
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
            <h2 className="text-3xl font-bold mb-6">How ASK Works</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our AI-powered legal research tool transforms complex legal queries into
              comprehensive, easy-to-understand answers. Whether you're dealing with
              contract disputes, employment issues, or regulatory compliance, ASK
              provides clear guidance tailored to your situation.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Plain-Language Explanations</h3>
                  <p className="text-muted-foreground">
                    We explain legal concepts in everyday language so you can understand
                    your rights and obligations without needing a law degree.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Step-by-Step Guidance</h3>
                  <p className="text-muted-foreground">
                    Get clear instructions on what to do next based on your specific
                    legal situation, with actionable next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Jurisdiction-Specific Insights</h3>
                  <p className="text-muted-foreground">
                    Receive guidance tailored to your location, ensuring you get
                    relevant and accurate legal information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-2xl p-8">
            <Card className="border border-border bg-card rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Example Legal Question
                </CardTitle>
                <CardDescription>
                  See how ASK transforms complex legal queries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="font-medium">User Question:</p>
                  <p className="text-muted-foreground mt-1">
                    "What do I need to prove if someone broke a contract with me?"
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium">ASK Response:</p>
                  <p className="text-muted-foreground mt-1">
                    "To prove a breach of contract, you typically need to show:
                    1) A valid contract existed, 2) You fulfilled your obligations,
                    3) The other party failed to fulfill theirs, and 4) You suffered
                    damages as a result. Based on your situation in California,
                    you have 4 years to file a lawsuit for written contracts."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                For general users who need simple legal guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Simple question interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Plain-language answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Key point summaries</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Actionable next steps</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">No legal expertise required</span>
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
                For legal professionals who need advanced research tools
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">IRAC format analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Case law citations with hyperlinks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Multi-jurisdiction support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Confidence scoring with explanations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Legal precedent comparison</span>
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
              Ready to Ask Your Legal Questions?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Get clear, actionable answers to your legal questions in seconds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
                <Link to="/public/assistant">
                  Try ASK Now
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

export default FeatureAsk;