import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PublicDashboard from "./PublicDashboard";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileEdit, Sparkles, Download, RefreshCw, Save, Share2, Loader2, BookOpen, MessageCircle, FileText, FileSpreadsheet, FileSignature } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { draftDocument } from "@/services/legalApi";

// Document types organized by category
const DOCUMENT_CATEGORIES = {
  "Contracts & Agreements": [
    { value: "nda", label: "Non-Disclosure Agreement (NDA)" },
    { value: "service", label: "Service Agreement" },
    { value: "employment", label: "Employment Contract" },
    { value: "partnership", label: "Partnership Agreement" },
    { value: "licensing", label: "Licensing Agreement" }
  ],
  "Petitions & Applications": [
    { value: "petition", label: "Court Petition" },
    { value: "application", label: "Legal Application" },
    { value: "filing", label: "Regulatory Filing" }
  ],
  "Court Orders & Judgments": [
    { value: "court-order", label: "Court Order" },
    { value: "judgment", label: "Legal Judgment" },
    { value: "ruling", label: "Court Ruling" }
  ],
  "Legal Briefs & Submissions": [
    { value: "brief", label: "Legal Brief" },
    { value: "submission", label: "Court Submission" },
    { value: "memorandum", label: "Legal Memorandum" }
  ],
  "Statutes & Regulations": [
    { value: "policy", label: "Internal Company Policy" },
    { value: "bylaws", label: "Corporate Bylaws" },
    { value: "regulation", label: "Regulatory Document" }
  ]
};

// Standard legal clauses
const LEGAL_CLAUSES = [
  { id: "definitions", label: "Definitions" },
  { id: "terms", label: "Terms and Conditions" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "payment", label: "Payment Terms" },
  { id: "termination", label: "Termination" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "dispute", label: "Dispute Resolution" },
  { id: "governing", label: "Governing Law" },
  { id: "force", label: "Force Majeure" },
  { id: "assignment", label: "Assignment" }
];

// Countries/Jurisdictions
const JURISDICTIONS = [
  { value: "india", label: "India" },
  { value: "newyork", label: "New York, USA" },
  { value: "texas", label: "Texas, USA" },
  { value: "florida", label: "Florida, USA" },
  { value: "delaware", label: "Delaware, USA" },
  { value: "federal", label: "Federal, USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "international", label: "International" }
];

const Draft = () => {
  const { mode } = useExperienceMode();
  const location = useLocation();
  const isPublicMode = location.pathname.startsWith('/public');
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftResult, setDraftResult] = useState<any | null>(null);
  const [docType, setDocType] = useState("nda");
  const [style, setStyle] = useState("formal");
  const [length, setLength] = useState("medium");
  const [jurisdictions, setJurisdictions] = useState<string[]>(["india"]);
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [specialProvisions, setSpecialProvisions] = useState("");
  const { toast } = useToast();

  // Initialize with some example prompt based on document type
  useEffect(() => {
    const examples: Record<string, string> = {
      nda: "Draft a mutual NDA between Tech Startup Inc. (Disclosing Party) and Innovation Labs (Receiving Party) for the purpose of discussing a potential partnership. Include standard confidentiality provisions, a 3-year term, and governing law of India.",
      service: "Draft a service agreement between ABC Web Solutions (Service Provider) and XYZ Corp (Client) for website development services. Include monthly payment of $5,000, 12-month term, 30-day termination notice, confidentiality obligations, and limitation of liability. Governed by Indian law.",
      employment: "Draft an employment contract for a Software Engineer position with standard benefits including health insurance, 401(k), and 15 days PTO. Include a 6-month probation period, confidentiality obligations, and at-will employment. Governed by Indian law.",
      partnership: "Draft a partnership agreement for a technology consulting firm between three partners with equal ownership. Include profit/loss sharing, decision-making procedures, and dispute resolution mechanisms. Governed by Delaware law.",
      licensing: "Draft a software licensing agreement for a SaaS product with monthly subscription fees, usage restrictions, and intellectual property protections. Include termination clauses and warranty disclaimers. Governed by New York law."
    };

    if (examples[docType]) {
      setPrompt(examples[docType]);
    }
  }, [docType]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a document description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare the request data with all parameters
      const requestData = {
        document_type: docType,
        requirements: prompt,
        jurisdictions: jurisdictions,
        style: style,
        length: length,
        clauses: selectedClauses,
        special_provisions: specialProvisions
      };
      
      // Log the request data for debugging
      console.log('Draft request data:', requestData);
      
      // Call the backend API
      const result = await draftDocument(requestData);
      
      setDraftResult({
        document: result.document,
        document_type: result.document_type,
        tokens_used: 0, // This would come from the backend in a real implementation
        processing_time: 0, // This would come from the backend in a real implementation
        word_count: result.document.split(' ').length,
        draft_id: "draft-" + Date.now()
      });
      
      toast({
        title: "Draft generated!",
        description: "Your document is ready for review and editing.",
      });
    } catch (error) {
      toast({
        title: "Draft generation failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
      console.error("Draft error:", error);
      // Log more detailed error information
      if (error.data) {
        console.error("Error data:", error.data);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJurisdictionToggle = (jurisdictionValue: string) => {
    setJurisdictions(prev =>
      prev.includes(jurisdictionValue)
        ? prev.filter(j => j !== jurisdictionValue)
        : [...prev, jurisdictionValue]
    );
  };

  const handleClauseToggle = (clauseId: string) => {
    setSelectedClauses(prev =>
      prev.includes(clauseId)
        ? prev.filter(id => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  const handleDownload = (format: string) => {
    if (!draftResult) return;

    let content = draftResult.document;
    let filename = `legal-document-${draftResult.draft_id}`;

    switch (format) {
      case 'txt':
        filename += '.txt';
        break;
      case 'pdf':
        filename += '.pdf';
        // In a real implementation, you would convert to PDF here
        break;
      case 'docx':
        filename += '.docx';
        // In a real implementation, you would convert to DOCX here
        break;
      default:
        filename += '.txt';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Document downloaded",
      description: `Your document has been downloaded as ${filename}`,
    });
  };

  // Helper function to avoid TypeScript errors
  const isLawyerMode = mode === 'lawyer' && !isPublicMode;

  // For public mode, we render content directly without a layout wrapper
  if (isPublicMode) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="h-5 w-5 text-primary" />
            </div>
            Create Legal Documents
          </h1>
          <p className="text-muted-foreground">
            Create legal documents with simple guidance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {!draftResult ? (
              <Card className="border border-border bg-card rounded-2xl">
                <CardHeader>
                  <CardTitle>What do you need?</CardTitle>
                  <CardDescription>Tell us what kind of document you need</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="simple-template">Document Type</Label>
                      <Select defaultValue="nda">
                        <SelectTrigger id="simple-template">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nda">
                            Keep something secret (NDA)
                          </SelectItem>
                          <SelectItem value="service">
                            Work agreement
                          </SelectItem>
                          <SelectItem value="employment">
                            Job contract
                          </SelectItem>
                          <SelectItem value="lease">
                            Rent space
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="simple-length">How detailed?</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="simple-length">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">
                              Just the basics
                            </SelectItem>
                            <SelectItem value="medium">
                              Standard details
                            </SelectItem>
                            <SelectItem value="long">
                              Comprehensive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="simple-jurisdiction">Where will this be used?</Label>
                        <Select defaultValue="india">
                          <SelectTrigger id="simple-jurisdiction">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="india">
                              India
                            </SelectItem>
                            <SelectItem value="newyork">
                              New York
                            </SelectItem>
                            <SelectItem value="other">
                              Other state
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">Describe what you need</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Example: I need an agreement between me and a company to keep our discussions secret. We're talking about a possible partnership."
                      className="min-h-32 resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border bg-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileEdit className="h-5 w-5 text-primary" />
                      Generated Document
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Your document is ready - review and download
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-border rounded-lg p-4 bg-muted/30 max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {draftResult.document
                        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
                        .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
                        .replace(/__(.*?)__/g, '$1')      // Remove bold underline markdown
                        .replace(/_(.*?)_/g, '$1')        // Remove italic underline markdown
                        .replace(/^#+\s*(.*?)$/gm, '$1')  // Remove headers
                        .replace(/^\s*[\r\n]/gm, '')      // Remove empty lines
                      }
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => handleDownload('txt')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download TXT
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload('pdf')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload('docx')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Download DOCX
                    </Button>
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" onClick={() => setDraftResult(null)}>
                      Create New
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border bg-card rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Popular Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setDocType("nda");
                    setPrompt("I need to keep some business discussions secret between me and another company. We're talking about a possible partnership.");
                  }}
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Non-Disclosure Agreement
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Protect your confidential information
                  </p>
                </div>

                <div
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setDocType("service");
                    setPrompt("I need an agreement for a web design project. The designer will charge $3,000 for the work.");
                  }}
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Service Agreement
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Define work terms and payment
                  </p>
                </div>

                <div
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setDocType("employment");
                    setPrompt("I'm hiring someone for a part-time job. I want to make sure we both understand the terms.");
                  }}
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Employment Contract
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hire someone with clear terms
                  </p>
                </div>

                <div
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setDocType("partnership");
                    setPrompt("I'm starting a business with two friends. We want to make sure we all understand our shares and responsibilities.");
                  }}
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Partnership Agreement
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Start a business with partners
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card rounded-2xl">
              <CardHeader>
                <CardTitle>Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Getting Started</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Be clear about who is involved</li>
                    <li>• Include important dates and amounts</li>
                    <li>• Mention what happens if things change</li>
                    <li>• Think about what's fair for everyone</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Common Elements</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Parties and definitions</li>
                    <li>• Scope of work/relationship</li>
                    <li>• Payment terms</li>
                    <li>• Confidentiality provisions</li>
                    <li>• Termination conditions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // For lawyer mode, use the original layout
  return (

    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileEdit className="h-5 w-5 text-primary" />
          </div>
          DRAFT - Document Generation
        </h1>
        <p className="text-muted-foreground">
          Generate professional legal documents with AI assistance and advanced tools.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {!draftResult ? (
            <Card className="border border-border bg-card rounded-2xl">
              <CardHeader>
                <CardTitle>Document Prompt</CardTitle>
                <CardDescription>
                  Describe the document you want to generate with specific legal requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-category">
                      Document Category
                    </Label>
                    <Select value={docType} onValueChange={setDocType}>
                      <SelectTrigger id="doc-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOCUMENT_CATEGORIES).map(([category, docs]) => (
                          <optgroup label={category} key={category}>
                            {docs.map(doc => (
                              <SelectItem key={doc.value} value={doc.value}>
                                {doc.label}
                              </SelectItem>
                            ))}
                          </optgroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="style">
                        Writing Style
                      </Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">Formal Legal</SelectItem>
                          <SelectItem value="plain">Plain English</SelectItem>
                          <SelectItem value="business">Business Formal</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="academic">Academic Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc-length">
                        Document Length
                      </Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger id="doc-length">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brief">Brief</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Jurisdictions/Countries
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {JURISDICTIONS.map(jurisdiction => (
                        <div key={jurisdiction.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`jurisdiction-${jurisdiction.value}`}
                            checked={jurisdictions.includes(jurisdiction.value)}
                            onCheckedChange={() => handleJurisdictionToggle(jurisdiction.value)}
                          />
                          <label
                            htmlFor={`jurisdiction-${jurisdiction.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {jurisdiction.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Standard Clauses</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {LEGAL_CLAUSES.map(clause => (
                        <div key={clause.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`clause-${clause.id}`}
                            checked={selectedClauses.includes(clause.id)}
                            onCheckedChange={() => handleClauseToggle(clause.id)}
                          />
                          <label
                            htmlFor={`clause-${clause.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {clause.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-provisions">
                      Special Provisions
                    </Label>
                    <Textarea
                      id="special-provisions"
                      placeholder="Enter any special clauses or provisions you want to include..."
                      className="min-h-24 resize-none"
                      value={specialProvisions}
                      onChange={(e) => setSpecialProvisions(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Document Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Draft a mutual NDA between Tech Startup Inc. and Innovation Labs for the purpose of discussing a potential partnership. Include standard confidentiality provisions and a 3-year term."
                    className="min-h-32 resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border bg-card rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5 text-primary" />
                    Generated Document
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Professional legal document ready for review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-border rounded-lg p-4 bg-muted/30 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {draftResult.document
                      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
                      .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
                      .replace(/__(.*?)__/g, '$1')      // Remove bold underline markdown
                      .replace(/_(.*?)_/g, '$1')        // Remove italic underline markdown
                      .replace(/^#+\s*(.*?)$/gm, '$1')  // Remove headers
                      .replace(/^\s*[\r\n]/gm, '')      // Remove empty lines
                    }
                  </pre>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleDownload('txt')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download TXT
                  </Button>
                  <Button variant="outline" onClick={() => handleDownload('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleDownload('docx')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download DOCX
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={() => setDraftResult(null)}>
                    Create New
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border border-border bg-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Document Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setDocType("nda");
                  setPrompt("Draft a mutual NDA between two parties for the purpose of discussing a potential business partnership. Include confidentiality obligations, a 3-year term, and governing law of India.");
                }}
              >
                <h3 className="font-medium flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  Non-Disclosure Agreement
                </h3>
                <p className="text-xs text-muted-foreground">Protect confidential information</p>
              </div>

              <div
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setDocType("service");
                  setPrompt("Draft a service agreement between a service provider and client for web development services. Include payment terms of $5,000/month, 12-month term, and confidentiality provisions.");
                }}
              >
                <h3 className="font-medium flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  Service Agreement
                </h3>
                <p className="text-xs text-muted-foreground">Define service terms and conditions</p>
              </div>

              <div
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setDocType("employment");
                  setPrompt("Draft an employment contract for a full-time employee with standard benefits and termination clauses. Include a 90-day probation period and at-will employment.");
                }}
              >
                <h3 className="font-medium flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  Employment Contract
                </h3>
                <p className="text-xs text-muted-foreground">Standard employment terms</p>
              </div>

              <div
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setDocType("partnership");
                  setPrompt("Draft a partnership agreement for a technology consulting firm between three partners with equal ownership. Include profit/loss sharing and decision-making procedures.");
                }}
              >
                <h3 className="font-medium flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  Partnership Agreement
                </h3>
                <p className="text-xs text-muted-foreground">Business partnership terms</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card rounded-2xl">
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">For Best Results</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Be specific about parties involved</li>
                  <li>• Include key terms and conditions</li>
                  <li>• Specify duration and termination</li>
                  {isLawyerMode && <li>• Define governing law and jurisdiction</li>}
                  <li>• Mention payment terms if applicable</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Common Elements</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Parties and definitions</li>
                  <li>• Scope of work/relationship</li>
                  <li>• Payment terms</li>
                  <li>• Confidentiality provisions</li>
                  <li>• Termination conditions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
};

export default Draft;