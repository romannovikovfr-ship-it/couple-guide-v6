import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useCrisis, useUpdateCrisisProgress } from "@/hooks/use-crises";
import { useGuide } from "@/hooks/use-guides";
import { useCrisisNotes, useCreateNote } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function CrisisSession() {
  const [, params] = useRoute("/crisis/:id");
  const id = parseInt(params?.id || "0");
  const { data: crisis, isLoading: crisisLoading } = useCrisis(id);
  // Only fetch guide if crisis exists and has a guideId
  const { data: guide, isLoading: guideLoading } = useGuide(crisis?.guideId || 0);
  
  const updateProgress = useUpdateCrisisProgress();
  const { data: notes } = useCrisisNotes(id);
  const createNote = useCreateNote();
  const { toast } = useToast();
  
  const [noteContent, setNoteContent] = useState("");

  if (crisisLoading) return <div className="p-8 max-w-3xl mx-auto"><Skeleton className="h-12 w-3/4 mb-4" /><Skeleton className="h-96 w-full" /></div>;
  if (!crisis) return <div className="p-8">Crisis not found</div>;

  // If no guide (custom crisis), default steps would be handled here, but for MVP assuming guide exists
  const steps = guide?.steps || [];
  const currentStep = steps[crisis.currentStepIndex];
  const isLastStep = crisis.currentStepIndex >= steps.length - 1;
  const progressPercent = ((crisis.currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      updateProgress.mutate({ id, stepIndex: crisis.currentStepIndex, isResolved: true }, {
        onSuccess: () => {
          toast({ title: "Session Complete", description: "You've completed this guide. Great job showing up for yourself." });
        }
      });
    } else {
      updateProgress.mutate({ id, stepIndex: crisis.currentStepIndex + 1 });
    }
  };

  const handlePrev = () => {
    if (crisis.currentStepIndex > 0) {
      updateProgress.mutate({ id, stepIndex: crisis.currentStepIndex - 1 });
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    createNote.mutate({ crisisId: id, content: noteContent }, {
      onSuccess: () => {
        setNoteContent("");
        toast({ title: "Note Saved", description: "Your thoughts have been recorded." });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-display font-bold text-foreground">{crisis.title}</h1>
          <span className="text-sm font-medium text-muted-foreground">Step {crisis.currentStepIndex + 1} of {steps.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={crisis.currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm min-h-[400px] flex flex-col"
            >
              {currentStep ? (
                <>
                  <h2 className="text-xl font-bold font-display mb-6 text-primary">{currentStep.title}</h2>
                  <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {currentStep.content}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <CheckCircle className="h-16 w-16 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Session Resolved</h2>
                  <p className="text-muted-foreground mb-6">You've completed all steps in this guide.</p>
                  <Button asChild className="btn-primary">
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!crisis.isResolved && (
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={crisis.currentStepIndex === 0 || updateProgress.isPending}
                className="w-32"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={updateProgress.isPending}
                className="w-32 btn-primary"
              >
                {isLastStep ? "Finish" : "Next Step"}
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar - Notes */}
        <div className="space-y-6">
          <div className="bg-secondary/20 rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Journal Notes
            </h3>
            <Textarea
              placeholder="Write down your feelings or key points..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[120px] bg-background mb-4"
            />
            <Button 
              size="sm" 
              className="w-full" 
              onClick={handleSaveNote}
              disabled={createNote.isPending || !noteContent.trim()}
            >
              Save Note
            </Button>
          </div>

          {notes && notes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Previous Notes</h4>
              {notes.map((note) => (
                <div key={note.id} className="bg-card p-4 rounded-lg border border-border/50 text-sm text-muted-foreground shadow-sm">
                  <p>{note.content}</p>
                  <span className="text-xs opacity-50 mt-2 block">
                    {new Date(note.createdAt!).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
