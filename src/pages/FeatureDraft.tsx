import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileEdit, 
  Users, 
  Gavel,
  FileSignature,
  Database,
  Share2,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const FeatureDraft = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            <FileEdit className="h-4 w-4 mr-2" />
            Document Drafting Tool
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Document Drafting
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create professional legal documents with guided templates and AI assistance. 
            From NDAs to employment contracts, generate legally sound documents quickly 
            and easily.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
              <Link to="/public/draft">
                Try DRAFT Now
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
            <h2 className="text-3xl font-bold mb-6">How DRAFT Works</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our intelligent document drafting tool generates professional legal 
              documents with customizable templates and version control. From NDAs 
              to employment contracts, DRAFT helps you create legally sound documents 
              quickly and easily.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileSignature className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Legal Templates</h3>
                  <p className="text-muted-foreground">
                    Start with professionally drafted templates for common legal 
                    documents, customized for your jurisdiction and needs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Jurisdiction-Specific Clauses</h3>
                  <p className="text-muted-foreground">
                    Automatically include legally required clauses and provisions 
                    based on your location and document type.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Collaborative Editing</h3>
                  <p className="text-muted-foreground">
                    Work together with colleagues, clients, or partners in real-time 
                    with version control and commenting features.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-2xl p-8">
            <Card className="border border-border bg-card rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5 text-primary" />
                  Example Document Creation
                </CardTitle>
                <CardDescription>
                  See how DRAFT creates legal documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="font-medium">User Request:</p>
                  <p className="text-muted-foreground mt-1">
                    "I need an NDA between my company and a potential partner. 
                    We're discussing a software licensing deal."
                  </p>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium">DRAFT Output:</p>
                  <p className="text-muted-foreground mt-1">
                    Generated comprehensive NDA with: 
                    - Mutual confidentiality obligations
                    - 3-year term with renewal option
                    - California governing law clause
                    - Standard exceptions and remedies
                    - Proper definitions section
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Hundreds of Document Types</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            DRAFT supports a wide range of legal documents for personal and business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Contracts & Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Non-Disclosure Agreements (NDAs)</li>
                <li>• Service Agreements</li>
                <li>• Employment Contracts</li>
                <li>• Partnership Agreements</li>
                <li>• Licensing Agreements</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Petitions & Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Court Petitions</li>
                <li>• Legal Applications</li>
                <li>• Regulatory Filings</li>
                <li>• Permit Applications</li>
                <li>• Appeal Documents</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Court Orders & Judgments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Court Orders</li>
                <li>• Legal Judgments</li>
                <li>• Court Rulings</li>
                <li>• Settlement Agreements</li>
                <li>• Consent Decrees</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Legal Briefs & Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Legal Briefs</li>
                <li>• Court Submissions</li>
                <li>• Legal Memoranda</li>
                <li>• Motion Papers</li>
                <li>• Opposition Papers</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Statutes & Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Internal Company Policies</li>
                <li>• Corporate Bylaws</li>
                <li>• Regulatory Documents</li>
                <li>• Compliance Manuals</li>
                <li>• Procedure Guides</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card rounded-xl">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Personal Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1">
                <li>• Wills & Trusts</li>
                <li>• Power of Attorney</li>
                <li>• Rental Agreements</li>
                <li>• Loan Agreements</li>
                <li>• Personal Contracts</li>
              </ul>
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
                For general users who need simple document creation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Guided document creation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Plain-language templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Simple editing tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Basic formatting options</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Download in multiple formats</span>
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
                For legal professionals who need advanced drafting tools
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Customizable legal templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Jurisdiction-specific clauses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Version control with change tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Collaborative editing with comments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Integration with legal databases</span>
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
              Ready to Create Your Documents?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Generate professional legal documents in minutes with AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow px-8" asChild>
                <Link to="/public/draft">
                  Try DRAFT Now
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

export default FeatureDraft;