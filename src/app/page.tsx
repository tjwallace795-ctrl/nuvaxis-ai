import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials-section";
import PricingSection4 from "@/components/ui/pricing-section-4";
import ContactSection from "@/components/contact-section";
import FooterSection from "@/components/footer-section";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function Home() {
  return (
    <>
      {/* Fixed cosmic background — persists behind all sections as you scroll */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg head="" text="" />
      </div>

      <main className="relative z-10 w-full">
        <Navbar />
        <HeroSection />
        <ServicesSection />
<HowItWorks />
        <TestimonialsSection />
        <div id="pricing">
          <PricingSection4 />
        </div>
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}
