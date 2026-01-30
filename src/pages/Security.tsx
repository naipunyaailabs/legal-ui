import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Lock, Server, UserCheck, FileText, Eye, CheckCircle2, AlertCircle, FileKey, Globe, Activity, Database, Download } from "lucide-react";
import { Link } from "react-router-dom";
import complianceData from "@/data/complianceDataIndia.json";
import { ComplianceIcon } from "@/components/ComplianceIcon";

const Security = () => {
    const [selectedCompliance, setSelectedCompliance] = useState<typeof complianceData[0] | null>(null);
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* 1. Hero Section */}
            <section className="container pt-32 pb-16 relative">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mx-auto">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Security & Trust</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Security & Trust
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        We prioritize the security and privacy of your legal documents with industry-standard protection, encrypted processing, and privacy-first AI workflows.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">Start Security Review</Button>
                        <Button size="lg" variant="outline">View Policies</Button>
                        <Button size="lg" variant="ghost">Ask a Security Question</Button>
                    </div>
                </div>
            </section>

            {/* 2. Data Protection Overview */}
            <section className="container py-12">
                <div className="bg-secondary/20 rounded-3xl p-8 md:p-12 border border-border">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Data Protection Overview</h2>
                            <p className="text-lg text-muted-foreground">
                                We employ rigorous security measures to ensure your data remains yours. Our architecture is built on privacy-by-design principles.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "User documents are encrypted in transit (TLS 1.2+)",
                                    "Documents are encrypted at rest (AES-256)",
                                    "Temporary processing: data is deleted immediately after analysis",
                                    "No training on customer documents",
                                    "No third-party sharing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-background border-border">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                    <Lock className="h-8 w-8 text-primary mb-2" />
                                    <span className="font-bold">AES-256</span>
                                    <span className="text-xs text-muted-foreground">Encryption at Rest</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-border">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                    <Globe className="h-8 w-8 text-primary mb-2" />
                                    <span className="font-bold">TLS 1.2+</span>
                                    <span className="text-xs text-muted-foreground">Encryption in Transit</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-border">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                    <Database className="h-8 w-8 text-primary mb-2" />
                                    <span className="font-bold">Isolated</span>
                                    <span className="text-xs text-muted-foreground">Data Environment</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-border">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                    <Activity className="h-8 w-8 text-primary mb-2" />
                                    <span className="font-bold">24/7</span>
                                    <span className="text-xs text-muted-foreground">Monitoring</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Security Principles */}
            <section className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Security Principles</h2>
                    <p className="text-muted-foreground">The pillars of our security infrastructure</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Encryption",
                            icon: Lock,
                            items: ["AES-256 encryption at rest", "TLS 1.2+ for all transfers", "Secure file storage"]
                        },
                        {
                            title: "Private AI Processing",
                            icon: Server,
                            items: ["Documents processed in isolated environments", "No data retention beyond user session", "No training on user content"]
                        },
                        {
                            title: "Access Control",
                            icon: UserCheck,
                            items: ["Role-based access", "Strict authentication", "No internal employee access to user documents"]
                        },
                        {
                            title: "Audit Logging",
                            icon: FileText,
                            items: ["System-level logging for suspicious activity", "Continuous monitoring"]
                        }
                    ].map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Card key={index} className="border border-border bg-card hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {card.items.map((item, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>


            {/* 5. Compliance Section */}
            <section className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Compliance</h2>
                    <p className="text-muted-foreground">Our security posture aligns with Indian and international frameworks</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {complianceData.map((item, index) => (
                        <Card key={index} className="border border-border bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <ComplianceIcon iconType={item.icon} className="h-10 w-10" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => setSelectedCompliance(item)}
                                        >
                                            View details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[525px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <ComplianceIcon iconType={item.icon} className="h-6 w-6" />
                                                </div>
                                                {item.title}
                                            </DialogTitle>
                                            <DialogDescription className="pt-4">
                                                {item.details}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-6 flex gap-3">
                                            <Button variant="outline" className="flex-1" disabled>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Report
                                            </Button>
                                            <Button variant="ghost" className="flex-1" asChild>
                                                <Link to="/contact">Contact Us</Link>
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-secondary/20 rounded-xl p-6 border border-border max-w-4xl mx-auto">
                    <p className="text-sm text-muted-foreground text-center leading-relaxed">
                        Legal Aid follows widely accepted security and privacy best practices. Our security posture is designed around Indian cybersecurity frameworks including CERT-In guidelines, DPDP Act 2023, and IT Act 2000, alongside internationally recognized standards such as ISO/IEC 27001 and RBI security guidelines.
                    </p>
                </div>
            </section>

            {/* 4. Product Security */}
            <section className="container py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Product Security</h2>
                        <p className="text-muted-foreground mb-8">
                            Our product is built with security at its core, utilizing modern development practices and infrastructure.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Secure Coding Practices", desc: "We follow OWASP guidelines and conduct regular code reviews to prevent vulnerabilities." },
                                { title: "Regular Vulnerability Checks", desc: "Automated scanning of dependencies and infrastructure for known security issues." },
                                { title: "Reputable Cloud Infrastructure", desc: "Hosted on industry-leading cloud providers with strict physical and network security." },
                                { title: "Least-Privilege Permissions", desc: "Access to system resources is restricted to only what is strictly necessary." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-secondary/20 rounded-3xl p-8 border border-border flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-6">Data Lifecycle Transparency</h3>
                        <div className="space-y-8 relative pl-8 border-l-2 border-primary/20">
                            {[
                                { title: "Document Uploaded", desc: "Secure upload via TLS 1.2+ encrypted channel." },
                                { title: "Encrypted Storage", desc: "File stored temporarily with AES-256 encryption." },
                                { title: "Isolated Analysis", desc: "AI processes content in a sandboxed environment." },
                                { title: "Results Delivered", desc: "Insights sent securely to your dashboard." },
                                { title: "Automatic Deletion", desc: "Raw file deleted from processing servers immediately." }
                            ].map((step, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-background border-2 border-primary" />
                                    <h4 className="font-bold text-lg">{step.title}</h4>
                                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Customer Data Rights & 7. Trust Indicators */}
            <section className="container py-16 bg-primary/5 rounded-3xl my-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold mb-4">Your Data, Your Rights</h2>
                    <p className="text-muted-foreground">
                        We believe in complete transparency and user control. You own your data, always.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: "User Control", desc: "You have full control over your documents and account data." },
                        { title: "Right to Delete", desc: "Request permanent deletion of your account and data at any time." },
                        { title: "No Monetization", desc: "We never sell, rent, or trade your personal information." }
                    ].map((item, i) => (
                        <div key={i} className="bg-background p-6 rounded-xl border border-border shadow-sm">
                            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-16 border-t border-primary/10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            "Privacy-first design",
                            "Encryption-first architecture",
                            "Zero data retention",
                            "Secure cloud environment",
                            "Internal access restrictions",
                            "Continuous monitoring"
                        ].map((tag, i) => (
                            <div key={i} className="bg-background px-4 py-3 rounded-lg border border-border text-center text-sm font-medium text-muted-foreground">
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. Security FAQs */}
            <section className="container py-16 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Security FAQs</h2>
                <Accordion type="single" collapsible className="w-full">
                    {[
                        { q: "Is my document stored permanently?", a: "No. Your documents are processed in a secure, temporary environment and are deleted after your session unless you explicitly choose to save them to your private vault." },
                        { q: "Do you use my data to train AI?", a: "No. We strictly do not use customer data to train our public AI models. Your data remains isolated and private." },
                        { q: "Who can access my uploaded files?", a: "Only you have access to your uploaded files. Our system uses strict role-based access controls, and no internal employees have access to user documents." },
                        { q: "What encryption do you use?", a: "We use industry-standard AES-256 encryption for data at rest and TLS 1.2+ for data in transit." },
                        { q: "How long is my data kept?", a: "Session data is deleted immediately after processing. Account data is kept until you choose to delete your account." }
                    ].map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* 9. Contact for Security Questions */}
            <section className="container py-16 text-center">
                <div className="bg-secondary/30 rounded-2xl p-8 max-w-2xl mx-auto">
                    <AlertCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Have a security concern?</h3>
                    <p className="text-muted-foreground mb-6">
                        Contact our security team through the website support form.
                    </p>
                    <Link to="/contact">
                        <Button>Contact Support</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Security;
