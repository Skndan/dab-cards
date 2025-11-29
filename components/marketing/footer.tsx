"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Twitter, Linkedin, Github, Instagram, Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <div className="flex gap-4">
              <Link href={siteConfig.links.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href={siteConfig.links.github} className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link></li>
              <li><Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and networking tips.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-background" />
              <Button size="icon" className="shrink-0">
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
