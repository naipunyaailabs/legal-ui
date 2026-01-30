import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, ArrowRight, FileText, AlertTriangle, ShieldCheck, FileSearch, Upload, Brain, FileOutput, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const InteractInfo = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="container pt-32 pb-16 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mx-auto lg:mx-0">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Advanced Document Intelligence</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Analyze Legal Documents
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Upload contracts, briefs, or case files. Our AI extracts key clauses, identifies risks, and provides instant summaries.
                        </p>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Analyze a Document
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Animated Hero Card */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-[320px] md:w-[380px] h-[450px] flex flex-col gap-4 transform transition-transform hover:scale-[1.02] duration-300">
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
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Risk Analysis",
                            description: "Automatically identify potential legal risks and liabilities in contracts.",
                            icon: AlertTriangle
                        },
                        {
                            title: "Clause Extraction",
                            description: "Instantly locate and extract key clauses like indemnity, termination, and more.",
                            icon: FileSearch
                        },
                        {
                            title: "Compliance Check",
                            description: "Ensure documents meet regulatory standards and internal compliance guidelines.",
                            icon: ShieldCheck
                        },
                        {
                            title: "Smart Summaries",
                            description: "Get concise, easy-to-read summaries of complex legal documents.",
                            icon: FileText
                        }
                    ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="border border-border bg-card rounded-xl p-6 hover:shadow-md transition-shadow">
                                <CardContent className="p-0 space-y-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Supported File Types Section */}
            <section className="container py-16 bg-secondary/30 rounded-3xl my-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Supported File Types</h2>
                        <p className="text-lg text-muted-foreground">
                            Our advanced OCR and text extraction engine supports a wide range of document formats.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "PDF Documents (Scanned & Native)",
                                "Microsoft Word (DOCX)",
                                "Image Files (PNG/JPG) with OCR",
                                "Text Files (TXT, RTF)"
                            ].map((type, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['PDF', 'DOCX', 'OCR', 'TXT'].map((ext, i) => (
                            <div key={i} className="bg-background rounded-xl p-8 text-center border border-border shadow-sm">
                                <span className="text-2xl font-bold text-primary">{ext}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Use Cases */}
            <section className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Example Use Cases</h2>
                    <p className="text-muted-foreground">Perfect for analyzing various types of legal agreements</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Employment Agreement",
                            description: "Review non-compete clauses, salary terms, and termination conditions."
                        },
                        {
                            title: "Service Agreement",
                            description: "Check scope of work, payment schedules, and liability limitations."
                        },
                        {
                            title: "Lease Contract",
                            description: "Analyze rent terms, deposit conditions, and maintenance responsibilities."
                        }
                    ].map((useCase, index) => (
                        <Card key={index} className="border border-border bg-card hover:border-primary transition-colors">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                                <p className="text-muted-foreground">{useCase.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground">From upload to insight in seconds</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>

                    {[
                        {
                            icon: Upload,
                            title: "Upload document",
                            description: "Drag and drop your file securely into our analyzer."
                        },
                        {
                            icon: Brain,
                            title: "AI analyzes structure",
                            description: "Our engine processes the content, identifying clauses and risks."
                        },
                        {
                            icon: FileOutput,
                            title: "Get insights",
                            description: "Receive a detailed report with summaries, risks, and exports."
                        }
                    ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="text-center space-y-4 bg-background p-4">
                                <div className="h-24 w-24 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center mx-auto">
                                    <Icon className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container py-16 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Common questions about document analysis</p>
                </div>
                <div className="grid gap-6">
                    {[
                        {
                            q: "What file formats are supported?",
                            a: "We support PDF (native and scanned), Microsoft Word (DOCX), TXT, and RTF formats. Our OCR engine handles image-based PDFs automatically."
                        },
                        {
                            q: "Is my document stored permanently?",
                            a: "No. Your documents are processed in a secure, temporary environment and are deleted after your session unless you explicitly choose to save them to your private vault."
                        },
                        {
                            q: "Can it handle handwritten text?",
                            a: "Our OCR is optimized for printed text. While it can recognize clear handwriting, accuracy is highest with typed documents."
                        },
                        {
                            q: "How accurate is the risk analysis?",
                            a: "Our risk analysis is based on standard legal compliance frameworks. It highlights potential issues for your review but should not replace a final human check."
                        }
                    ].map((faq, index) => (
                        <Card key={index} className="border border-border bg-card">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-24">
                <div className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/10">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Start analyzing documents
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Ensure your contracts are safe, compliant, and risk-free.
                        </p>
                        <div className="pt-4">
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Analyze a Document
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
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
            `}</style>
        </div>
    );
};

export default InteractInfo;
