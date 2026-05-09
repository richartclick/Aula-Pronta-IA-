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
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      {/* Spacer igual à altura da navbar fixa (h-16 = 64px). Usa inline style
          para ser imune a conflitos entre CSS layers e o reset global padding:0 */}
      <div style={{ height: '4rem' }} aria-hidden="true" />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <DemoSection />
      <ProofSection />
      <PlansSection />
      <LeadSection />
      <Footer />
    </main>
  );
}
