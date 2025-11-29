"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-20 md:pb-16">
      {/* Animated Background Gradient */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-75" />
      </div> */}

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Badge */}
          <ScrollAnimation variant="scale" duration={0.6}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-5 py-2 text-sm font-medium text-primary mb-8 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <Sparkles className="h-4 w-4" />
              AI-Powered Networking Platform
            </div>
          </ScrollAnimation>

          {/* Main Heading */}
          <ScrollAnimation variant="slideUp" delay={0.1}>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              Your Business Card,
              <br className="hidden sm:block" />
              <span className="text-primary">
                Supercharged by AI
              </span>
            </h1>
          </ScrollAnimation>

          {/* Subheading */}
          <ScrollAnimation variant="slideUp" delay={0.2}>
            <p className="text-xl sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-normal">
              Capture leads instantly. Enrich contact data automatically.
              <span className="text-foreground font-normal"> Never lose a connection again.</span>
            </p>
          </ScrollAnimation>

          {/* CTAs */}
          <ScrollAnimation variant="slideUp" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full w-full sm:w-auto border-2 backdrop-blur-sm hover:bg-muted/50 transition-all duration-300">
                Watch Demo
              </Button>
            </div>
          </ScrollAnimation>

          {/* Social Proof */}
          <ScrollAnimation variant="fade" delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" className="h-full w-full" />
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-bold">10,000+</span> professionals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-muted-foreground">4.9/5 rating</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
