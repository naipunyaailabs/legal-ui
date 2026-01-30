import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, FileText, FileEdit, MessageCircle, Scale, User, LogOut, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import GlobalSidebar from "@/components/GlobalSidebar";
import { useSidebar } from "@/contexts/SidebarContext";

interface PublicDashboardProps {
  children?: ReactNode;
}

const PublicDashboard = ({ children }: PublicDashboardProps) => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const navItems = [
    { icon: Home, label: "Home", path: "/public" },
    { icon: Search, label: "Ask", path: "/public/assistant" },
    { icon: FileText, label: "Interact", path: "/public/interact" },
    { icon: FileEdit, label: "Draft", path: "/public/draft" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* New Global Collapsible Sidebar */}
      <GlobalSidebar isPublic={true} />

      {/* Main Content */}
      <div
        className="flex flex-col w-full bg-muted/40 transition-all duration-200"
        style={{
          marginLeft: isCollapsed ? "70px" : "256px",
        }}
      >
        {/* Top Bar - Clean and Minimal */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b border-border">
                  <Link to="/" className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Legal AId</span>
                  </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-border">
                  <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Back to Home</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:block">
              <Link to="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Legal AId</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content - Simplified for public view */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children ? (
            // If children are provided, render them directly without additional padding
            <div className="w-full">
              {children}
            </div>
          ) : (
            // Default home page content
            <div className="max-w-7xl mx-auto w-full">
              <div className="space-y-6 py-4 w-full">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Welcome to Legal AId</h1>
                      <p className="text-muted-foreground">Get simple answers to your legal questions</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/public/assistant">
                    <div className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Ask Legal Questions</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Get simple, easy-to-understand answers to your legal questions
                      </p>
                      <Button variant="outline" className="w-full">
                        Ask Now
                      </Button>
                    </div>
                  </Link>

                  <Link to="/public/interact">
                    <div className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Analyze Documents</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Upload and analyze legal documents with AI insights
                      </p>
                      <Button variant="outline" className="w-full">
                        Analyze Now
                      </Button>
                    </div>
                  </Link>

                  <Link to="/public/draft">
                    <div className="border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <FileEdit className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Draft Documents</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Tell us what you need, we'll help you create legal documents
                      </p>
                      <Button variant="outline" className="w-full">
                        Create Document
                      </Button>
                    </div>
                  </Link>

                </div>

                {/* Helpful Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border bg-card rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary">1</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          <span className="font-medium">Ask</span> - Describe your legal question in simple terms
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary">2</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          <span className="font-medium">Get</span> - Receive clear explanations in plain language
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary">3</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          <span className="font-medium">Act</span> - Use the information to make informed decisions
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-border bg-card rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Tips for Best Results</h3>
                    <ul className="space-y-3 text-muted-foreground text-sm">
                      <li className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p>Be as specific as possible about your situation</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p>Mention your location if it's location-specific</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p>Ask one question at a time for clearer answers</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PublicDashboard;