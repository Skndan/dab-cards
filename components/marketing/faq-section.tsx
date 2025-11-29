"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { siteConfig } from "@/config/site"

const faqs = [
  {
    question: "How does the AI contact capture work?",
    answer: "Our AI analyzes the image of a business card or the text from a digital profile to automatically extract and categorize contact information. It identifies names, emails, phone numbers, companies, and job titles with high accuracy.",
  },
  {
    question: "Can I sync contacts with my CRM?",
    answer: "Yes! We support direct integrations with popular CRMs like Salesforce, HubSpot, and Pipedrive. You can also sync contacts to Google Contacts, Outlook, or export them as CSV.",
  },
  {
    question: "Is there a free plan available?",
    answer: `We offer a 14-day free trial on all plans so you can experience the full power of ${siteConfig.name}. After the trial, we have affordable plans starting at just $5/month.`,
  },
  {
    question: "Do I need an app to view a digital card?",
    answer: "No app is required! Your digital business card is a web page that can be viewed in any browser. Recipients can save your contact info directly to their phone without downloading anything.",
  },
  {
    question: "Can I customize the design of my card?",
    answer: "Absolutely. You can choose from our professionally designed themes, upload your logo, change colors, and add a banner image to match your brand identity.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use bank-grade encryption to protect your data and are fully GDPR compliant. We never sell your data to third parties.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container max-w-3xl">
        <div className="mb-16 text-center">
          <ScrollAnimation variant="slideUp">
            <h2 className="mb-6 font-heading text-4xl font-bold sm:text-5xl">
              Frequently Asked Questions
            </h2>
          </ScrollAnimation>
          <ScrollAnimation variant="slideUp" delay={0.1}>
            <p className="text-xl text-muted-foreground">
              {`Have a question? We're here to help.`}
            </p>
          </ScrollAnimation>
        </div>

        <ScrollAnimation variant="slideUp" delay={0.2}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollAnimation>
      </div>
    </section>
  )
}
