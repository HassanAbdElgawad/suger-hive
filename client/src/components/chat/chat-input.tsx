import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Paperclip, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 border-t bg-background/50 backdrop-blur-lg">
      <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground rounded-full h-10 w-10">
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="relative flex-1 bg-muted/50 rounded-[24px] border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all overflow-hidden">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              disabled={disabled}
              className="min-h-[44px] w-full resize-none border-0 bg-transparent py-3 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
              rows={1}
            />
        </div>

        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || disabled}
          size="icon"
          className={cn(
            "rounded-full h-10 w-10 shrink-0 transition-all duration-200",
            input.trim() 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
              : "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground opacity-50"
          )}
        >
          <SendHorizontal className="h-5 w-5 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
