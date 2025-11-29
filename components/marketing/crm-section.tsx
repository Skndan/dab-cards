import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CRMSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">
              Seamless Integration with <br />
              <span className="text-primary">Your Workflow</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Connect your digital card to the tools you already use.
              Automate data entry and keep your CRM up to date.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium">Zapier Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium">Outlook & Google Contacts Sync</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Check className="h-4 w-4" />
                </div>
                <span className="font-medium">HubSpot & Salesforce Ready</span>
              </div>
            </div>

            <Button className="mt-8" size="lg">
              Explore Integrations <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative rounded-2xl border bg-background p-8 shadow-lg">
            {/* Abstract representation of integrations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-32 items-center justify-center rounded-xl bg-orange-50 p-6">
                <span className="text-xl font-bold text-orange-600">Zapier</span>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl bg-blue-50 p-6">
                <span className="text-xl font-bold text-blue-600">Outlook</span>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl bg-orange-50 p-6">
                <span className="text-xl font-bold text-orange-600">HubSpot</span>
              </div>
              <div className="flex h-32 items-center justify-center rounded-xl bg-blue-50 p-6">
                <span className="text-xl font-bold text-blue-600">Salesforce</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
