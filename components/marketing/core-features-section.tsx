import {
  Smartphone,
  QrCode,
  Wallet,
  Palette,
  Globe,
  Share2
} from "lucide-react"

const features = [
  {
    title: "Unlimited Digital Cards",
    description: "Create as many cards as you need for different roles or businesses.",
    icon: Smartphone,
  },
  {
    title: "QR Code & NFC",
    description: "Share instantly with a scan or a tap. No app required for the receiver.",
    icon: QrCode,
  },
  {
    title: "Digital Wallet Pass",
    description: "Add your card to Apple Wallet or Google Wallet for quick access.",
    icon: Wallet,
  },
  {
    title: "Custom Branding",
    description: "Your logo, your colors, your theme. Make it truly yours.",
    icon: Palette,
  },
  {
    title: "Custom Domain",
    description: "Use your own domain (user.com/card) for a professional look.",
    icon: Globe,
  },
  {
    title: "Easy Sharing",
    description: "Share via link, WhatsApp, email, social media, and more.",
    icon: Share2,
  },
]

export function CoreFeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl">
            Everything you need in a <br />
            <span className="text-primary">Digital Business Card</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to help you make a lasting impression and grow your network.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
