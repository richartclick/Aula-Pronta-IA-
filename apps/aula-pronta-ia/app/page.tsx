import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import ProofSection from "@/components/sections/ProofSection";
import DemoSection from "@/components/sections/DemoSection";
import PlansSection from "@/components/sections/PlansSection";
import LeadSection from "@/components/sections/LeadSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <ProofSection />
      <DemoSection />
      <PlansSection />
      <LeadSection />
      <Footer />
    </main>
  );
}
