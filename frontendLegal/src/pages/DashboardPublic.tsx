import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, FileEdit, Heart, Sparkles, BookOpen, FileQuestion, Lightbulb, MessageCircle } from "lucide-react"; // Added MessageCircle icon
import { Link } from "react-router-dom";

const DashboardPublic = () => {
  // Legal resources for public users
  const legalResources = [
    {
      title: "Legal Guides",
      description: "Easy-to-understand guides on common legal topics",
      icon: BookOpen,
      link: "/dashboard/resources/guides"
    },
    {
      title: "FAQs",
      description: "Frequently asked questions about legal processes",
      icon: FileQuestion,
      link: "/dashboard/resources/faq"
    },
    {
      title: "Legal Dictionary",
      description: "Simple explanations of legal terms",
      icon: Search,
      link: "/dashboard/resources/dictionary"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 py-4 w-full">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="text-muted-foreground">Let's make legal work simple and clear</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tools */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Get Started</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Changed to 4 columns */}
              <Link to="/dashboard/assistant">
                <Card className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">ASK</CardTitle>
                    <CardDescription className="text-sm">
                      Get simple answers to legal questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-sm">
                      Ask Question
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/dashboard/interact">
                <Card className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">INTERACT</CardTitle>
                    <CardDescription className="text-sm">
                      Upload documents and get explanations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-sm">
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/dashboard/draft">
                <Card className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <FileEdit className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">DRAFT</CardTitle>
                    <CardDescription className="text-sm">
                      Tell us what you need, we'll draft it
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-sm">
                      Create Document
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Added Chat Card */}
              <Link to="/dashboard/chat">
                <Card className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">CHAT</CardTitle>
                    <CardDescription className="text-sm">
                      Conversational legal assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-sm">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Legal Resources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Legal Resources</h2>
            </div>

            <Card className="border border-border bg-card">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {legalResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <Link key={index} to={resource.link} className="block">
                        <div className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{resource.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{resource.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Helpful Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Be Specific</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The more details you provide, the better we can help you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Save Important Items</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bookmark research and documents you might need later.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Get Help</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact support if you need assistance with legal documents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPublic;