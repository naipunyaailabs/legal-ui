import React from 'react';
import { useExperienceMode } from '@/contexts/ExperienceModeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Scale, MessageCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ModeToggle = () => {
  const { mode } = useExperienceMode();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2 transition-all duration-500",
                mode === 'lawyer' 
                  ? "bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 border-blue-700 shadow-md" 
                  : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 border-blue-200 shadow-md"
              )}
            >
              {mode === 'lawyer' ? (
                <Scale className="h-4 w-4" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
            <p>
              {mode === 'lawyer' 
                ? "Lawyer Mode: Professional legal tools with detailed analysis, legal references, and structured reasoning." 
                : "Public Mode: Simple explanations and easy-to-understand summaries for everyone."}
            </p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs bg-gray-900 text-white border-gray-700">
            <p>
              {mode === 'lawyer' 
                ? "Lawyer Mode: Professional legal tools with detailed analysis, legal references, and structured reasoning." 
                : "Public Mode: Simple explanations and easy-to-understand summaries for everyone."}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ModeToggle;