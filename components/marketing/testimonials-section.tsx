"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Star } from "lucide-react"
import { siteConfig } from "@/config/site"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Sales Director at TechFlow",
    content: `${siteConfig.name} has completely transformed how our sales team connects with leads. The AI capture is a game-changer—no more manual data entry!`,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder of GrowthLabs",
    content: "I used to lose so many business cards after conferences. Now, everything is digitized instantly and synced to my CRM. Incredible tool.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    name: "Emily Watson",
    role: "Real Estate Agent",
    content: "The digital cards look stunning and professional. My clients are always impressed when I share my card with just a tap.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    name: "David Kim",
    role: "Marketing Manager",
    content: "The analytics feature helps me understand which networking events are actually driving value. Highly recommended for any professional.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    name: "Jessica Lee",
    role: "Freelance Designer",
    content: "Finally, a digital business card that actually looks good! The customization options are fantastic and it fits my personal brand perfectly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
  {
    name: "Tom Baker",
    role: "Event Organizer",
    content: `We used ${siteConfig.name} for our entire conference team. It made sharing contact info seamless and efficient. A must-have for events.`,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <ScrollAnimation variant="slideUp">
            <h2 className="mb-6 font-heading text-4xl font-bold sm:text-5xl">
              Loved by professionals
            </h2>
          </ScrollAnimation>
          <ScrollAnimation variant="slideUp" delay={0.1}>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who are upgrading their networking game.
            </p>
          </ScrollAnimation>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation key={index} variant="slideUp" delay={0.1 * index} className="break-inside-avoid">
              <div className="rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border">
                    <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
