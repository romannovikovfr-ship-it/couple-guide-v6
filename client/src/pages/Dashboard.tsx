import { useAuth } from "@/hooks/use-auth";
import { useGuides } from "@/hooks/use-guides";
import { useCrises, useCreateCrisis } from "@/hooks/use-crises";
import { GuideCard } from "@/components/GuideCard";
import { CrisisActiveCard } from "@/components/CrisisActiveCard";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: guides, isLoading: guidesLoading } = useGuides();
  const { data: crises, isLoading: crisesLoading } = useCrises();
  const createCrisis = useCreateCrisis();

  const activeCrises = crises?.filter(c => !c.isResolved) || [];
  
  const handleStartGuide = async (guideId: number) => {
    const guide = guides?.find(g => g.id === guideId);
    if (!guide) return;

    createCrisis.mutate({
      userId: user!.id,
      guideId: guide.id,
      title: guide.title,
      description: guide.description,
    }, {
      onSuccess: (newCrisis) => {
        setLocation(`/crisis/${newCrisis.id}`);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display text-foreground">Welcome, {user?.firstName || 'Friend'}</h1>
        <p className="text-muted-foreground mt-2">How can we support you today?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active & Tools */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Active Crises */}
          {activeCrises.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Active Sessions
              </h2>
              <div className="grid gap-4">
                {activeCrises.map(crisis => (
                  <CrisisActiveCard key={crisis.id} crisis={crisis} />
                ))}
              </div>
            </section>
          )}

          {/* Quick Tools */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
            <Link href="/reaction-helper">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/30 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-background rounded-full shadow-sm text-primary group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-primary group-hover:text-primary/80">Reaction Helper AI</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Describe a situation and get instant advice on how to respond constructively and calmly.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Guide Library */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Crisis Guides</h2>
            </div>
            
            {guidesLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {guides?.map((guide) => (
                  <GuideCard 
                    key={guide.id} 
                    guide={guide} 
                    onStart={handleStartGuide}
                    isStarting={createCrisis.isPending}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Tips / Affirmations (Static for now) */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-display text-lg font-semibold mb-4">Daily Reminder</h3>
            <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4 py-1 mb-4">
              "In conflict, being heard is often more important than being right."
            </blockquote>
            <p className="text-sm text-muted-foreground">
              Take a deep breath before responding. You are building a stronger relationship, one difficult conversation at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
