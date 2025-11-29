 

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/repo",
        icon: "repos",
        title: "Repo",
      },
      { href: "/integrations", icon: "link", title: "Integrations" },
      // {
      //   href: "/admin/orders",
      //   icon: "package",
      //   title: "Orders",
      //   badge: 2,
      //   authorizeOnly: UserRole.ADMIN,
      // },
      {
        href: "/post",
        icon: "post",
        title: "Posts",
      },
      // {
      //   href: "/changelog",
      //   icon: "post",
      //   title: "Changelogs",
      //   isNew: true
      // },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/settings", icon: "settings", title: "Settings" },
      // { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      // {
      //   href: "#",
      //   icon: "messages",
      //   title: "Support",
      //   authorizeOnly: UserRole.USER,
      // },
    ],
  },
];
