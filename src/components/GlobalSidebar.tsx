import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Search, FileText, FileEdit, MessageCircle, Scale, LogOut, Home, ChevronLeft, ChevronRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

interface GlobalSidebarProps {
  isPublic?: boolean;
}

const GlobalSidebar = ({ isPublic = true }: GlobalSidebarProps) => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const basePath = isPublic ? "/public" : "/dashboard";

  const navItems = [
    { icon: Home, label: "Home", path: isPublic ? "/public" : "/dashboard" },
    { icon: MessageCircle, label: "Ask", path: `${basePath}/assistant` },
    { icon: FileText, label: "Interact", path: `${basePath}/interact` },
    { icon: FileEdit, label: "Draft", path: `${basePath}/draft` },
    { icon: Bot, label: "Agents", path: `${basePath}/agents` },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="fixed left-0 top-0 h-screen border-r border-border bg-card flex flex-col overflow-hidden"
      style={{
        width: isCollapsed ? "70px" : "256px",
        transition: "width 200ms ease",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div className="h-20 border-b border-border flex items-center justify-between flex-shrink-0 overflow-hidden" style={{ padding: isCollapsed ? "0 8px" : "0 16px" }}>
        {!isCollapsed ? (
          <>
            <Link to="/" className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                Legal AId
              </span>
            </Link>
            <button
              onClick={() => setIsCollapsed(true)}
              className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded transition-colors duration-200 flex-shrink-0 ml-2"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded transition-colors duration-200 mx-auto"
            title="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Logo Icon - Only in Collapsed Mode */}
      {isCollapsed && (
        <div className="flex items-center justify-center" style={{ height: "auto", padding: "8px 0" }}>
          <Link to="/" className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200">
            <Scale className="h-5 w-5 text-primary" />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-hidden" style={{ padding: isCollapsed ? "12px 0" : "12px 8px" }}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div
                key={item.path}
                style={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-start", padding: isCollapsed ? "0" : "0 0" }}
              >
                <Link
                  to={item.path}
                  title={isCollapsed ? item.label : ""}
                  className={cn(
                    "h-10 rounded-lg transition-colors duration-200 flex items-center",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  style={{
                    width: isCollapsed ? "40px" : "calc(100% - 0px)",
                    padding: isCollapsed ? "0" : "0 12px",
                    gap: "12px",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" style={{ minWidth: "20px", minHeight: "20px" }} />
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap" style={{ display: isCollapsed ? "none" : "inline" }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border flex-shrink-0 overflow-hidden" style={{ padding: isCollapsed ? "12px 0" : "12px 8px" }}>
        <div style={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-start" }}>
          <Link
            to="/"
            title={isCollapsed ? "Back to Home" : ""}
            className={cn(
              "h-10 rounded-lg transition-colors duration-200 text-muted-foreground hover:bg-muted hover:text-foreground flex items-center"
            )}
            style={{
              width: isCollapsed ? "40px" : "calc(100% - 0px)",
              padding: isCollapsed ? "0" : "0 12px",
              gap: "12px",
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" style={{ minWidth: "20px", minHeight: "20px" }} />
            {!isCollapsed && (
              <span className="font-medium text-sm whitespace-nowrap" style={{ display: isCollapsed ? "none" : "inline" }}>
                Back to Home
              </span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default GlobalSidebar;
