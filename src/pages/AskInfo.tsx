import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, ArrowRight, Search, Scale, BookOpen, Shield, Bot, Sparkles, Send, Settings, Icon } from "lucide-react";
import { Link } from "react-router-dom";

const AskInfo = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="container pt-32 pb-16 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mx-auto lg:mx-0">
                            <Search className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Smart Legal Research</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Ask Legal Questions
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Get clear, simple, legally-informed answers instantly. Our AI analyzes your question and provides structured, cited responses.
                        </p>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link to="/public/assistant">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Ask Your Question Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Animated Hero Card */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-[320px] md:w-[380px] h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-300">
                            {/* Mini Header */}
                            <div className="h-12 border-b border-gray-100 flex items-center px-4 justify-between bg-white">
                                <div className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-bold text-gray-700">Legal Assistant</span>
                                </div>
                                <Settings className="h-4 w-4 text-gray-400" />
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-4 space-y-4 bg-gray-50/50 relative overflow-hidden">
                                {/* User Message */}
                                <div className="flex justify-end animate-[chat-user_5s_infinite]">
                                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-[85%] shadow-sm">
                                        What are the elements of negligence?
                                    </div>
                                </div>

                                {/* Processing Indicator */}
                                <div className="flex gap-2 animate-[chat-loader_5s_infinite]">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-primary" />
                                        <div className="flex gap-1">
                                            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                                            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-75" />
                                            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Response - IRAC */}
                                <div className="flex gap-2 animate-[chat-bot_5s_infinite]">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[95%] text-xs space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-semibold border-b border-gray-50 pb-2">
                                            <Sparkles className="h-4 w-4" />
                                            <span>IRAC Analysis</span>
                                        </div>
                                        <div className="space-y-2">
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
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="bg-gray-50 rounded-xl border border-gray-200 h-10 flex items-center px-4 justify-between">
                                    <span className="text-sm text-gray-400">Ask a follow-up...</span>
                                    <Send className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Feature Badges */}
                        <div className="absolute top-20 -right-4 lg:-right-12 bg-white/90 backdrop-blur shadow-lg px-3 py-1.5 rounded-lg text-xs font-medium text-primary animate-[float-badge_5s_infinite] hidden md:block" style={{ animationDelay: '0.5s' }}>
                            Case Law Citations
                        </div>
                        <div className="absolute bottom-32 -left-4 lg:-left-12 bg-white/90 backdrop-blur shadow-lg px-3 py-1.5 rounded-lg text-xs font-medium text-primary animate-[float-badge_5s_infinite] hidden md:block" style={{ animationDelay: '1.0s' }}>
                            Confidence Score: 92%
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "IRAC Format",
                            description: "Structured responses with Issue, Rule, Application, and Conclusion.",
                            icon: Scale
                        },
                        {
                            title: "Case Law References",
                            description: "Citations from relevant legal cases to support the analysis.",
                            icon: BookOpen
                        },
                        {
                            title: "Multi-jurisdiction",
                            description: "Answers tailored to specific legal jurisdictions and regions.",
                            icon: Shield
                        },
                        {
                            title: "Confidence Scoring",
                            description: "AI-generated confidence scores for every legal insight provided.",
                            icon: CheckCircle2
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

            {/* Sample Questions Section */}
            <section className="container py-16 bg-secondary/30 rounded-3xl my-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Common Legal Questions</h2>
                    <p className="text-muted-foreground">Examples of what you can ask our AI</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[
                        "What are my rights as a tenant if my landlord refuses repairs?",
                        "Explain the divorce procedure and timeline in California.",
                        "What is the limitation period for filing a personal injury claim?",
                        "Can my employer terminate me without notice?"
                    ].map((question, index) => (
                        <Card key={index} className="border border-border bg-background hover:border-primary transition-colors cursor-default">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">?</span>
                                </div>
                                <p className="font-medium">{question}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground">Three simple steps to get your answers</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>

                    {[
                        {
                            step: "01",
                            title: "Type your question",
                            description: "Enter your legal query in plain English. No legal jargon needed."
                        },
                        {
                            step: "02",
                            title: "AI Analysis",
                            description: "Our engine analyzes laws, statutes, and precedents relevant to your issue."
                        },
                        {
                            step: "03",
                            title: "Get Answer",
                            description: "Receive a clear, structured response with citations and next steps."
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
                    <p className="text-muted-foreground">Common questions about our legal research tool</p>
                </div>
                <div className="grid gap-6">
                    {[
                        {
                            q: "What is the confidence score?",
                            a: "The confidence score indicates how certain our AI is about the answer based on the available legal data and precedents found."
                        },
                        {
                            q: "Can I trust the legal advice provided?",
                            a: "Our tool provides legal information and research assistance, not legal advice. Always verify critical information with a qualified attorney."
                        },
                        {
                            q: "Which jurisdictions are covered?",
                            a: "We currently cover major common law jurisdictions including the US, UK, India, and Canada, with specific state/regional filters available."
                        },
                        {
                            q: "Is my search history private?",
                            a: "Yes, all your queries are encrypted and private. We do not use your specific client data to train our public models."
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
                            Ready to get answers?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Start asking your legal questions today and get instant clarity.
                        </p>
                        <div className="pt-4">
                            <Link to="/public/assistant">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 h-12 text-lg">
                                    Ask Your Question Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

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
              @keyframes float-badge {
                0%, 45% { opacity: 0; transform: translateY(10px); }
                50%, 90% { opacity: 1; transform: translateY(0); }
                95%, 100% { opacity: 0; transform: translateY(10px); }
              }
            `}</style>
        </div>
    );
};

export default AskInfo;
