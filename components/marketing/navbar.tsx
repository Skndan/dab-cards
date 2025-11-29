import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-bold text-xl">
          <Sparkles className="h-6 w-6 text-primary" />
          <span>{siteConfig.name}</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#" className="hover:text-primary transition-colors">Products</Link>
          <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-primary transition-colors">Learn</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login">
            <Button className="rounded-full px-6">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
