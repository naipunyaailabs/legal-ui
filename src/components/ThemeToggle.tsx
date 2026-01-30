import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function ThemeToggle() {
  return (
    <AnimatedThemeToggler className="relative w-9 h-9 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" />
  );
}