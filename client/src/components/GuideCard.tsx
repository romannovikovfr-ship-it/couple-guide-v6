import { type CrisisGuide } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

interface GuideCardProps {
  guide: CrisisGuide;
  onStart: (guideId: number) => void;
  isStarting: boolean;
}

export function GuideCard({ guide, onStart, isStarting }: GuideCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="h-32 w-full bg-secondary/30 relative overflow-hidden">
        {/* Abstract pattern placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="absolute bottom-4 left-4 p-2 bg-background/80 backdrop-blur rounded-lg">
           <BookOpen className="h-5 w-5 text-primary" />
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-display text-xl text-foreground">{guide.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground">{guide.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={() => onStart(guide.id)} 
          disabled={isStarting}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2"
        >
          {isStarting ? "Starting..." : "Begin Guide"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
