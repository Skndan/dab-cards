 

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MAIN",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Overview" },
      { href: "/cards", icon: "idCard", title: "Cards" },
      { href: "/contacts", icon: "user", title: "Contacts" },
      { href: "/events", icon: "calendar", title: "Events" },
      { href: "/virtual-backgrounds", icon: "monitorPlay", title: "Virtual Backgrounds" },
    ],
  },
  {
    title: "GROW & AUTOMATE",
    items: [
      { href: "/introductions", icon: "sparkles", title: "Introductions" },
      { href: "/deals", icon: "trendingUp", title: "Deals & Revenue" },
      { href: "/sequences", icon: "send", title: "Email Sequences" },
      { href: "/linkedin", icon: "linkedin", title: "LinkedIn Engagement" },
      { href: "/deal-rooms", icon: "folderKanban", title: "Deal Rooms" },
      { href: "/scan-events", icon: "scanLine", title: "Event Mode" },
      { href: "/group-cards", icon: "users", title: "Group Cards" },
      { href: "/network-health", icon: "activity", title: "Network Health" },
      { href: "/reminders", icon: "alarmClock", title: "Reminders" },
      { href: "/feedback", icon: "messageCircle", title: "Feedback" },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { href: "/analytics", icon: "barChart3", title: "Analytics" },
      { href: "/roi", icon: "lineChart", title: "ROI Dashboard" },
    ],
  },
  {
    title: "SETUP",
    items: [
      { href: "/integrations", icon: "link", title: "Integrations" },
      { href: "/billing", icon: "creditCard", title: "Billing" },
      { href: "/settings", icon: "settings", title: "Settings" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
    ],
  },
];