import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAnalyzeReaction } from "@/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function ReactionHelper() {
  const { user } = useAuth();
  const analyze = useAnalyzeReaction();

  const [formData, setFormData] = useState({
    situation: "",
    partnerSaid: "",
    myReaction: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">AI Reaction Helper</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          In the heat of the moment, it's hard to find the right words. Describe what happened, 
          and our AI will help you reframe and respond constructively.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Input Form */}
        <Card className="shadow-md border-border/60">
          <CardHeader>
            <CardTitle>Describe the Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="situation">What is happening right now?</Label>
                <Textarea 
                  id="situation"
                  placeholder="e.g. We are arguing about finances again..."
                  value={formData.situation}
                  onChange={e => setFormData({...formData, situation: e.target.value})}
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerSaid">What did they say or do?</Label>
                <Textarea 
                  id="partnerSaid"
                  placeholder="e.g. They said I am irresponsible with money."
                  value={formData.partnerSaid}
                  onChange={e => setFormData({...formData, partnerSaid: e.target.value})}
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="myReaction">What is your initial reaction/impulse?</Label>
                <Textarea 
                  id="myReaction"
                  placeholder="e.g. I want to yell back that they spend too much too."
                  value={formData.myReaction}
                  onChange={e => setFormData({...formData, myReaction: e.target.value})}
                  className="bg-background/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary h-12 text-lg" 
                disabled={analyze.isPending}
              >
                {analyze.isPending ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" /> Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Get Advice
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {analyze.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-primary/5 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  Constructive Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Analysis</h3>
                  <p className="text-muted-foreground">{analyze.data.analysis}</p>
                </div>
                
                <div className="bg-background p-4 rounded-xl border border-primary/20 shadow-sm">
                  <h3 className="font-semibold mb-2 text-primary">Try Saying This:</h3>
                  <p className="text-lg italic text-foreground/80 leading-relaxed">
                    "{analyze.data.betterResponse}"
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Why this works</h3>
                  <p className="text-muted-foreground">{analyze.data.suggestion}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {analyze.error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Sorry, we couldn't analyze that. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}
