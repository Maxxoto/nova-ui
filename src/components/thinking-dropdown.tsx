"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingDropdownProps {
  thinkingProcess?: string;
  className?: string;
}

export function ThinkingDropdown({
  thinkingProcess,
  className,
}: ThinkingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinkingProcess) {
    return null;
  }

  return (
    <div className={cn("mb-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-0! text-xs text-muted-foreground hover:text-foreground border"
      >
        <Brain className="h-3 w-3 ml-2" />
        <span>Thinking Process</span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3 mr-2" />
        ) : (
          <ChevronDown className="h-3 w-3 mr-2" />
        )}
      </Button>

      {isOpen && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
            {thinkingProcess}
          </pre>
        </div>
      )}
    </div>
  );
}
