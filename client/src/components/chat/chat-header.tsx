import { Persona } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Video, ChevronLeft, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ChatHeaderProps {
  persona: Persona;
  onBack: () => void;
  isMobile: boolean;
}

export function ChatHeader({ persona, onBack, isMobile }: ChatHeaderProps) {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" className="-ml-2 mr-1" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        <div className="relative">
          <div className="h-9 w-9 rounded-full overflow-hidden border bg-muted">
            <img src={persona.avatar} alt={persona.name} className="h-full w-full object-cover" />
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
        </div>
        
        <div>
          <h2 className="font-semibold text-sm leading-none">{persona.name}</h2>
          <span className="text-xs text-muted-foreground">{persona.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Video className="h-5 w-5" />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Details</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted">
                <img src={persona.avatar} alt={persona.name} className="h-full w-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">{persona.name}</h3>
                <p className="text-muted-foreground">{persona.role}</p>
              </div>
              <div className="w-full space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-1 text-sm">About</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{persona.description}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-1 text-sm">System Prompt</h4>
                  <p className="text-xs font-mono text-muted-foreground bg-background/50 p-2 rounded border">{persona.systemPrompt}</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
