import {
  Brain,
  Sparkles,
  Users,
  Zap,
  MessageSquare,
  History
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AIFeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Networking
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl">
            Your Network, <span className="text-primary">Supercharged</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Let AI handle the busy work while you focus on building relationships.
          </p>
        </div>

        <Tabs defaultValue="enrichment" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
            <TabsTrigger value="followup">Follow-Up</TabsTrigger>
            <TabsTrigger value="categorize">Categorize</TabsTrigger>
            <TabsTrigger value="smartmode">Smart Mode</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="enrichment">
              <FeatureCard
                icon={Brain}
                title="AI Lead Enrichment"
                description="Instantly fetch LinkedIn summaries, job roles, and company details when someone scans your card. Get a 'Lead Score' to prioritize your connections."
              />
            </TabsContent>
            <TabsContent value="followup">
              <FeatureCard
                icon={MessageSquare}
                title="AI Follow-Up Generator"
                description="Automatically generate personalized follow-up emails, WhatsApp messages, and LinkedIn connection notes. Never forget to follow up again."
              />
            </TabsContent>
            <TabsContent value="categorize">
              <FeatureCard
                icon={Users}
                title="AI Auto-Categorization"
                description="Automatically tag contacts as Clients, Recruiters, Vendors, or Friends based on their profile and interaction."
              />
            </TabsContent>
            <TabsContent value="smartmode">
              <FeatureCard
                icon={Zap}
                title="Dynamic Smart Card Mode"
                description="Your card adapts to the viewer. Recruiters see your resume, customers see pricing, and investors see your pitch deck."
              />
            </TabsContent>
            <TabsContent value="memory">
              <FeatureCard
                icon={History}
                title="AI Memory for Relationships"
                description="Remember where you met, what you talked about, and promised follow-ups. It's like having a personal CRM assistant."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
