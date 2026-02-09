import { Navigation } from "@/components/ui/Navigation";
import { Hero } from "@/components/sections/Hero";
import { AIModels } from "@/components/sections/AIModels";
import { ControlOutcome } from "@/components/sections/ControlOutcome";
import { Workflows } from "@/components/sections/Workflows";
import { AppMode } from "@/components/sections/AppMode";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <Hero />
      <AIModels />
      <ControlOutcome />
      <Workflows />
      <AppMode />
      <Footer />
    </div>
  );
}
