"use client"

import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import Link from "next/link"

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <ScrollAnimation variant="slideUp">
            <h2 className="mb-6 font-heading text-4xl font-bold sm:text-5xl">
              Simple, transparent pricing
            </h2>
          </ScrollAnimation>
          <ScrollAnimation variant="slideUp" delay={0.1}>
            <p className="text-xl text-muted-foreground">
              Start for free, upgrade when you need more power. No hidden fees.
            </p>
          </ScrollAnimation>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <ScrollAnimation variant="slideUp" delay={0.2} className="h-full">
            <div className="relative flex flex-col h-full rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Starter</h3>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $5
                  <span className="ml-1 text-base font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Perfect for individuals just starting out.</p>
              </div>
              <ul className="mb-8 space-y-4 flex-1">
                {["5 Digital Cards", "100 AI Contact Captures", "Basic Analytics", "Standard Support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-full text-base">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          {/* Pro Plan */}
          <ScrollAnimation variant="scale" delay={0.3} className="h-full">
            <div className="relative flex flex-col h-full rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl scale-105 z-10">
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary">Pro</h3>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $12
                  <span className="ml-1 text-base font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For professionals who network often.</p>
              </div>
              <ul className="mb-8 space-y-4 flex-1">
                {["Unlimited Digital Cards", "Unlimited AI Captures", "Advanced Analytics", "CRM Integrations", "Priority Support", "Custom Branding"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full">
                <Button className="w-full h-12 rounded-full text-base shadow-lg shadow-primary/25 hover:shadow-primary/40">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          {/* Team Plan */}
          <ScrollAnimation variant="slideUp" delay={0.4} className="h-full">
            <div className="relative flex flex-col h-full rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Team</h3>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  $25
                  <span className="ml-1 text-base font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For small teams and businesses.</p>
              </div>
              <ul className="mb-8 space-y-4 flex-1">
                {["5 Team Members", "Centralized Management", "Team Analytics", "Admin Controls", "Dedicated Success Manager"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-full text-base">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
