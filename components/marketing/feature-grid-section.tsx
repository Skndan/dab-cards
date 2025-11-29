"use client"

import { ArrowRight, Smartphone, Zap, Share2, Users, BarChart3, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { siteConfig } from "@/config/site"

const features = [
  {
    title: "Smart Digital Cards",
    description: "Create stunning, fully customizable digital business cards that look great on any device. Update them anytime, instantly. Your card adapts to the viewer—recruiters see your resume, clients see your portfolio.",
    icon: Smartphone,
    image: "https://placehold.co/600x400/png?text=Digital+Card+Demo", // Placeholder for GIF/Screenshot
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    title: "AI Lead Capture",
    description: "Never type contact details again. Scan paper cards or QR codes to instantly capture and enrich contact details using advanced AI. We automatically find their LinkedIn, company info, and more.",
    icon: Zap,
    image: "https://placehold.co/600x400/png?text=AI+Capture+Demo", // Placeholder for GIF/Screenshot
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Seamless Sharing",
    description: "Share your card via QR code, NFC, email, SMS, or link. No app required for recipients to view or save your details. It just works, everywhere.",
    icon: Share2,
    image: "https://placehold.co/600x400/png?text=Sharing+Demo", // Placeholder for GIF/Screenshot
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
]

export function FeatureGridSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <ScrollAnimation variant="slideUp">
            <h2 className="mb-6 font-heading text-4xl font-bold sm:text-5xl">
              Experience the <span className="text-primary">future of networking</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation variant="slideUp" delay={0.1}>
            <p className="text-xl text-muted-foreground">
              See how {siteConfig.name} transforms your professional interactions with powerful, visual tools.
            </p>
          </ScrollAnimation>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col gap-12 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

              {/* Text Content */}
              <div className="flex-1 space-y-8">
                <ScrollAnimation variant="slideUp" delay={0.2}>
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} ${feature.color} mb-6`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {["Instant setup", "Works offline", "Real-time analytics"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        <div className={`h-2 w-2 rounded-full ${feature.color.replace('text-', 'bg-')}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="rounded-full group">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </ScrollAnimation>
              </div>

              {/* Visual Content */}
              <div className="flex-1 w-full">
                <ScrollAnimation variant={index % 2 === 0 ? "slideRight" : "slideLeft"} delay={0.3}>
                  <div className={`relative rounded-3xl border ${feature.borderColor} bg-card/50 p-4 shadow-2xl overflow-hidden aspect-video group`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-transparent z-10" />
                    {/* Placeholder for GIF/Video/Image */}
                    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                          View Demo
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
