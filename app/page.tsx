import { HeroSection } from "@/components/marketing/hero-section"
import { SocialProofSection } from "@/components/marketing/social-proof-section"
import { FeatureGridSection } from "@/components/marketing/feature-grid-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"
import { PricingSection } from "@/components/marketing/pricing-section"
import { FAQSection } from "@/components/marketing/faq-section"
import { Footer } from "@/components/marketing/footer"
import { StructuredData } from "@/components/marketing/structured-data"

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <SocialProofSection />
        <FeatureGridSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        {/* <Footer /> */}
      </div>
    </>
  )
}
