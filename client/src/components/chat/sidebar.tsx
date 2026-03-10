import { Persona, ChatSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SidebarProps {
  personas: Persona[];
  sessions: Record<string, ChatSession>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function Sidebar({ personas, sessions, selectedId, onSelect, className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full border-r bg-sidebar/50 backdrop-blur-xl", className)}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Chats</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search" 
            className="pl-9 bg-sidebar-accent/50 border-transparent focus:bg-background transition-all rounded-xl" 
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4">
          {personas.map((persona) => {
            const session = sessions[persona.id];
            const lastMessage = session?.lastMessage;
            const lastTime = session?.lastTimestamp;
            const isSelected = selectedId === persona.id;

            return (
              <button
                key={persona.id}
                onClick={() => onSelect(persona.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isSelected 
                    ? "bg-sidebar-accent shadow-sm" 
                    : "hover:bg-sidebar-accent/50"
                )}
              >
                <div className="relative shrink-0">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-border/50 bg-background">
                    <img src={persona.avatar} alt={persona.name} className="h-full w-full object-cover" />
                  </div>
                  {/* Status Indicator (Mock) */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn("font-medium truncate", isSelected ? "text-foreground" : "text-foreground/90")}>
                      {persona.name}
                    </span>
                    {lastTime && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatDistanceToNow(lastTime, { addSuffix: false }).replace('about ', '')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-muted-foreground truncate pr-2">
                      {lastMessage || <span className="italic opacity-50">Start a conversation</span>}
                    </p>
                    {/* Unread Indicator (Mock) */}
                    {/* <span className="h-2 w-2 rounded-full bg-primary shrink-0" /> */}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
