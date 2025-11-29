import { siteConfig } from "@/config/site"

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url || "https://dab-cards.com",
    "logo": `${siteConfig.url || "https://dab-cards.com"}/logo.png`,
    "description": siteConfig.description,
    "sameAs": [
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": siteConfig.name,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "5.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an AI-powered digital business card?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An AI-powered digital business card automatically captures contact information when someone scans your QR code, enriches the contact data using AI, categorizes them, and generates personalized follow-up messages.",
        },
      },
      {
        "@type": "Question",
        "name": "How does AI enrichment work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When someone scans your card and submits their contact info, our AI automatically searches for their LinkedIn profile, extracts job title, company information, industry, and calculates a lead score to help you prioritize connections.",
        },
      },
      {
        "@type": "Question",
        "name": "Is there a free trial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer a 1-month free trial on all plans. No credit card required. You can cancel anytime during the trial period.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
