import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import HowItWorks from "@/components/how-it-works";
import TestimonialsSection from "@/components/testimonials-section";
import PricingSection4 from "@/components/ui/pricing-section-4";
import ContactSection from "@/components/contact-section";
import FooterSection from "@/components/footer-section";

export default function Home() {
  return (
    <main className="w-full bg-black">
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
  );
}
