import type { Metadata } from "next";
import { Gabarito, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";

import { siteConfig } from "@/config/site";

const inter = Gabarito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gabarito",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.description}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "digital business card",
    "AI business card",
    "smart business card",
    "QR code business card",
    "contact management",
    "lead capture",
    "AI networking",
    "business card app",
    "virtual business card",
    "electronic business card",
    "networking automation",
    "CRM integration",
    "contact enrichment",
    "follow-up automation",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url || "https://dab-cards.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url || "https://dab-cards.com",
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Smart Digital Business Cards`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@aibusinesscards",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative overflow-x-hidden"
        )}
      >
        {/* Background Gradient */}
        {/* <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1 pt-0">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
