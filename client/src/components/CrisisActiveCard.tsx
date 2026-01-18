import { type UserCrisis } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface CrisisActiveCardProps {
  crisis: UserCrisis;
}

export function CrisisActiveCard({ crisis }: CrisisActiveCardProps) {
  // Safe default for total steps if not available in data yet (usually joined with guide)
  // For MVP we might just assume 5-10 steps or show relative progress
  const progressPercent = Math.min((crisis.currentStepIndex / 8) * 100, 100); 

  return (
    <Card className="border-l-4 border-l-accent shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent text-sm font-medium uppercase tracking-wider">
            <AlertCircle className="h-4 w-4" />
            Active Session
          </div>
          <span className="text-xs text-muted-foreground">
            Started {new Date(crisis.createdAt!).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="font-display text-2xl mt-2">{crisis.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground mb-4">{crisis.description || "In progress..."}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>Step {crisis.currentStepIndex + 1}</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-secondary" />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/crisis/${crisis.id}`} className="w-full">
          <Button className="w-full btn-primary gap-2">
            Continue Session
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
