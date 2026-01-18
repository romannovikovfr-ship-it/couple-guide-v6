import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={item} className="mb-6 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Relationship First Aid
              </span>
            </motion.div>
            <motion.h1 variants={item} className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Navigate relationship storms with <span className="text-primary italic">grace</span>.
            </motion.h1>
            <motion.p variants={item} className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              When emotions run high, it's hard to think clearly. We provide step-by-step guidance 
              and AI-powered support to help you move through conflicts and rebuild connection.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="btn-primary text-lg px-8 h-14">
                <a href="/api/login">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <a href="#how-it-works" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/30 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="bg-secondary/20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-12">
            {[
              {
                icon: Shield,
                title: "Crisis Guides",
                description: "Step-by-step workflows for common relationship issues like heated arguments, broken trust, or silent treatment."
              },
              {
                icon: Sparkles,
                title: "AI Reaction Helper",
                description: "Not sure what to say? Our AI analyzes the situation and suggests constructive, de-escalating responses."
              },
              {
                icon: Heart,
                title: "Emotional Safety",
                description: "Designed to lower anxiety and promote understanding, helping you reconnect with your partner."
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">{feature.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
