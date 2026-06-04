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
            text: "✦ Now booking new clients.",
            linkText: "Get a free demo",
            linkHref: "#contact",
          }}
          title="Websites That Work."
          highlight="Leads That Convert."
          description="AI-integrated websites and targeted ad campaigns engineered to generate real leads for your business. Built hands-on. Managed for you."
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
