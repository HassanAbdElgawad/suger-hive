import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 text-sm shadow-sm relative group",
          isUser 
            ? "bg-primary text-primary-foreground message-bubble-sent" 
            : "bg-white dark:bg-zinc-800 text-foreground border border-border/50 message-bubble-received"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span 
          className={cn(
            "text-[10px] opacity-0 group-hover:opacity-70 transition-opacity absolute bottom-1",
            isUser ? "right-full mr-2 text-muted-foreground" : "left-full ml-2 text-muted-foreground"
          )}
        >
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
