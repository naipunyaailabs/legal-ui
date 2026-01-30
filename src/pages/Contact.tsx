import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Send, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="container pt-32 pb-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        We'd Love to Hear from You
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Have a question about our legal AI tools? Our team is here to help.
                    </p>
                </div>
            </section>

            <section className="container pb-24">
                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

                    {/* Contact Information */}
                    <div className="space-y-8 animate-[fade-in-up_0.5s_ease-out]">
                        <div className="grid gap-6">
                            <Card className="border border-border bg-card hover:border-primary transition-colors overflow-hidden group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">Visit Us</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Cognitbotz Solutions Pvt Ltd, 4th Floor,<br />
                                            3rd Avenue, Patrika Nagar, HITEC City,<br />
                                            Madhapur, Hyderabad, Telangana 500081<br />
                                            India
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-border bg-card hover:border-primary transition-colors overflow-hidden group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">Call Us</h3>
                                        <p className="text-muted-foreground">Mon-Fri from 9am to 6pm</p>
                                        <a href="tel:+919346575094" className="text-lg font-semibold hover:text-primary transition-colors block mt-1">
                                            +91 9346575094
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-border bg-card hover:border-primary transition-colors overflow-hidden group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground">Our friendly team is here to help.</p>
                                        <a href="mailto:Hello@CognitBotz.com" className="text-lg font-semibold hover:text-primary transition-colors block mt-1">
                                            Hello@CognitBotz.com
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Social Media & Hours */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" /> Business Hours
                                </h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                                    <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 2:00 PM</span></li>
                                    <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Follow Us</h3>
                                <div className="flex gap-4">
                                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="border border-border bg-card shadow-lg animate-[fade-in-up_0.5s_ease-out_0.2s] fill-mode-backwards">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Send us a message</h2>
                                <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[150px]" />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg">
                                    Send Message
                                    <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Contact;
