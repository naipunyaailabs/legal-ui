import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Search, FileText, FileEdit, Scale, Settings, User, LogOut, MessageCircle } from "lucide-react";
import ModeToggle from "./mode-toggle/ModeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import GlobalSidebar from "@/components/GlobalSidebar";
import { useSidebar } from "@/contexts/SidebarContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isCollapsed } = useSidebar();

  const navItems = [
    { icon: Search, label: "ASK", path: "/dashboard/ask" },
    { icon: FileText, label: "INTERACT", path: "/dashboard/interact" },
    { icon: FileEdit, label: "DRAFT", path: "/dashboard/draft" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* New Global Collapsible Sidebar */}
      <GlobalSidebar isPublic={false} />

      {/* Main Content */}
      <div
        className="flex flex-col w-full transition-all duration-200"
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
                  <Link to="/dashboard" className="flex items-center gap-3">
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

                <div className="p-4">
                  <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive("/dashboard/settings")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                    <Settings className="h-5 w-5" />
                    <span className="font-medium text-sm">Settings</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* Removed redundant desktop logo since it's in the sidebar */}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.display_name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;