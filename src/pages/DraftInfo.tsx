import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, ArrowRight, FileEdit, PenTool, Wand2, FileCheck, Layers, Settings, Sparkles, Save, Download } from "lucide-react";
import { Link } from "react-router-dom";

const DraftInfo = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="container pt-32 pb-16 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mx-auto lg:mx-0">
                            <FileEdit className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">AI-Powered Document Generation</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Draft Legal Documents with AI
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Generate clear, professional legal drafts instantly using smart templates. From NDAs to contracts, create legally sound documents in minutes.
                        </p>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Create a New Document
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Animated Hero Card */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-[320px] md:w-[380px] h-[450px] transform transition-transform hover:scale-[1.02] duration-300">
                            {/* Input Form */}
                            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 absolute inset-0 z-10 flex flex-col gap-5 animate-[cycle-form_5s_infinite]">
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <FileEdit className="h-5 w-5 text-purple-600" />
                                    <span className="text-base font-bold text-gray-800">Draft Document</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="text-xs text-gray-500 font-medium">Document Type</div>
                                        <div className="h-10 border border-gray-200 rounded-lg flex items-center px-3 text-sm text-gray-700 bg-gray-50">
                                            Non-Disclosure Agreement (NDA)
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-xs text-gray-500 font-medium">Jurisdiction</div>
                                        <div className="h-10 border border-gray-200 rounded-lg flex items-center px-3 text-sm text-gray-700 bg-gray-50">
                                            India
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-xs text-gray-500 font-medium">Requirements</div>
                                        <div className="h-20 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 bg-gray-50 leading-relaxed">
                                            Draft a mutual NDA for a partnership discussion regarding a new software product launch...
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="w-full bg-purple-600 text-white h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-md animate-[button-press-loop_5s_infinite]">
                                        <Sparkles className="h-4 w-4" /> Generate Draft
                                    </div>
                                </div>
                            </div>

                            {/* Generated Doc */}
                            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-0 absolute inset-0 z-0 flex flex-col animate-[cycle-doc_5s_infinite] overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Generated
                                    </span>
                                    <div className="flex gap-2">
                                        <div className="p-1.5 hover:bg-gray-200 rounded cursor-pointer"><Save className="h-4 w-4 text-gray-500" /></div>
                                        <div className="p-1.5 hover:bg-gray-200 rounded cursor-pointer"><Download className="h-4 w-4 text-gray-500" /></div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 bg-white overflow-hidden relative">
                                    <div className="text-center mb-6">
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-black inline-block pb-1">Non-Disclosure Agreement</div>
                                    </div>
                                    <div className="space-y-3 text-[10px] text-gray-600 leading-relaxed font-serif">
                                        <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '0s' }}>
                                            This Non-Disclosure Agreement (the "Agreement") is entered into by and between the undersigned parties...
                                        </div>
                                        <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '0.5s' }}>
                                            1. <span className="font-bold">Confidential Information</span>. The parties agree to maintain strict confidentiality regarding all proprietary information shared...
                                        </div>
                                        <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '1.0s' }}>
                                            2. <span className="font-bold">Term</span>. This Agreement shall remain in effect for a period of 3 years from the date of execution...
                                        </div>
                                        <div className="animate-[type-line-loop_5s_infinite]" style={{ animationDelay: '1.5s' }}>
                                            3. <span className="font-bold">Governing Law</span>. This Agreement shall be governed by the laws of India.
                                        </div>
                                    </div>

                                    {/* Signature Lines */}
                                    <div className="mt-12 flex justify-between px-2">
                                        <div className="w-24 border-t border-gray-300 pt-1 text-[9px] text-gray-400">Disclosing Party</div>
                                        <div className="w-24 border-t border-gray-300 pt-1 text-[9px] text-gray-400">Receiving Party</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Popular Templates</h2>
                    <p className="text-muted-foreground">Start with a pre-built template or create your own</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Affidavit",
                            description: "Sworn statements for various legal purposes.",
                            icon: FileCheck
                        },
                        {
                            title: "Contract Agreement",
                            description: "Select from our library or start fresh."
                        },
                        {
                            step: "02",
                            title: "Add your inputs",
                            description: "Fill in the key details and requirements."
                        },
                        {
                            step: "03",
                            title: "AI generates draft",
                            description: "Review, edit, and export your final document."
                        }
                    ].map((item, index) => (
                        <div key={index} className="text-center space-y-4 bg-background p-4">
                            <div className="h-24 w-24 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container py-16 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Common questions about document drafting</p>
                </div>
                <div className="grid gap-6">
                    {[
                        {
                            q: "Can I edit the templates?",
                            a: "Absolutely. All templates are fully customizable. You can add, remove, or modify clauses to suit your specific needs."
                        },
                        {
                            q: "Are these templates legally binding?",
                            a: "Our templates are drafted based on standard legal requirements, but a document's binding nature depends on proper execution (signatures, witnessing) and local laws."
                        },
                        {
                            q: "Can I export to Word?",
                            a: "Yes, you can export your finalized documents to Microsoft Word (.docx) or PDF formats instantly."
                        },
                        {
                            q: "Do you support custom clauses?",
                            a: "Yes, you can save your own custom clauses to your personal library and reuse them across different documents."
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
                            Start drafting now
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Create legally sound documents without the headache.
                        </p>
                        <div className="pt-4">
                            <Link to="/auth">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Create a New Document
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
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

// Helper components for icons not in the main import to keep code clean
const AlertTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
);

const LightbulbIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
);

const FileOutputIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><path d="M14 2v6h6" /><path d="M2 15h10" /><path d="m9 18 3-3-3-3" /></svg>
);

export default DraftInfo;
