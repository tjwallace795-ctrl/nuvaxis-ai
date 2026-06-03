import Navbar from "@/components/navbar";
import { HeroLanding } from "@/components/ui/hero-1";
import FounderSection from "@/components/founder-section";
import ServicesSection from "@/components/services-section";
import PricingSection4 from "@/components/ui/pricing-section-4";
import ContactSection from "@/components/contact-section";
import FooterSection from "@/components/footer-section";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";

export default function Home() {
  return (
    <>
      {/* Fixed brand background — persists behind all sections as you scroll */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg head="" text="" />
      </div>

      <main className="relative z-10 w-full">
        <Navbar />

        {/* Page 1 — Hero */}
        <HeroLanding
          showHeader={false}
          announcementBanner={{
            text: "✦ Now booking new clients —",
            linkText: "get a free demo",
            linkHref: "#contact",
          }}
          title="Your Business,"
          highlight="Powered by AI"
          description="Custom AI websites, 24/7 chatbots, online ordering, and ad campaigns — everything your business needs to compete at the highest level, built and managed for you."
          callToActions={[
            { text: "Contact Us Now", href: "#contact", variant: "primary" },
            { text: "See Pricing", href: "#pricing", variant: "secondary" },
          ]}
          titleSize="large"
          gradientColors={{ from: "#3b82f6", to: "#a855f7" }}
        />

        {/* Page 2 — Founder: photo, name, what I do */}
        <FounderSection />

        <ServicesSection />
        <div id="pricing">
          <PricingSection4 />
        </div>
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}
