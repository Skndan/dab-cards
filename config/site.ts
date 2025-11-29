import { env } from "@/env"

export const siteConfig = {
  name: "DabCardx",
  description: "AI-Powered Digital Business Card Platform",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/opengraph-image.jpg`,
  links: {
    twitter: "https://twitter.com/dabcards",
    github: "https://github.com/dabcards",
  },
  auth: {
    keycloakUrl: env.NEXT_PUBLIC_KEYCLOAK_URL,
    realm: env.NEXT_PUBLIC_KEYCLOAK_REALM,
    clientId: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  },
}

export type SiteConfig = typeof siteConfig
