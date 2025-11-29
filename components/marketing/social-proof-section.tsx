"use client"

import { motion } from "framer-motion"

const companies = [
  "Google", "Microsoft", "Spotify", "Amazon", "Netflix", "Adobe", "Tesla", "Uber", "Airbnb", "Slack"
]

export function SocialProofSection() {
  return (
    <section className="border-y bg-background py-10 overflow-hidden">
      <div className="container text-center mb-8">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trusted by forward-thinking teams
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {/* First set of logos */}
          {companies.map((company, index) => (
            <span key={index} className="text-xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default">
              {company}
            </span>
          ))}
          {/* Duplicate set for seamless loop */}
          {companies.map((company, index) => (
            <span key={`dup-${index}`} className="text-xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default">
              {company}
            </span>
          ))}
          {/* Triplicate set for wide screens */}
          {companies.map((company, index) => (
            <span key={`trip-${index}`} className="text-xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default">
              {company}
            </span>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
