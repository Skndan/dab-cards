"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { UpgradeCard } from "@/components/dashboard/upgrade-card";
import { Icons } from "@/components/shared/icons";
import { Label } from "../ui/label";
import { NavUser } from "./nav-user";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const { isTablet } = useMediaQuery();
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);

  const isSidebarExpanded = manualExpanded !== null ? manualExpanded : !isTablet;

  const toggleSidebar = () => {
    setManualExpanded(!isSidebarExpanded);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
    >
      <SidebarHeader>
        <div className="flex h-14 items-center p-2 ">
          {isSidebarExpanded && (
            <div className="flex flex-row items-center gap-2">
              <Icons.logo className="size-6" />
              <Label className="text-md font-bold">{siteConfig.name}</Label>
            </div>
          )} 
        </div>
      </SidebarHeader>

      <SidebarContent>
        {links.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  if (!item.href) return null;
                  const Icon = Icons[item.icon || "arrowRight"];
                  const isActive = !!path.match(item.href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        disabled={item.disabled}
                      >
                        <Link href={item.disabled ? "#" : item.href}>
                          <Icon className="size-5" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                              {item.badge}
                            </Badge>
                          )}
                          {item.isNew && <Badge variant="new">New</Badge>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
        {/* {isSidebarExpanded && <UpgradeCard />} */}
      </SidebarFooter>
    </Sidebar>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b p-6 text-lg font-semibold">
              <Icons.logo className="size-6" />
              <span className="font-urban text-xl font-bold">
                {siteConfig.name}
              </span>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-y-4 p-6">
                {links.map((section) => (
                  <div key={section.title} className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {section.title}
                    </p>
                    <div className="flex flex-col gap-1">
                      {section.items.map((item) => {
                        if (!item.href) return null;
                        const Icon = Icons[item.icon || "arrowRight"];
                        const isActive = !!path.match(item.href);

                        return (
                          <Link
                            key={item.title}
                            onClick={() => {
                              if (!item.disabled) setOpen(false);
                            }}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted",
                              isActive
                                ? "bg-muted"
                                : "text-muted-foreground hover:text-accent-foreground",
                              item.disabled &&
                              "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground"
                            )}
                          >
                            <Icon className="size-5" />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                {item.badge}
                              </Badge>
                            )}
                            {item.isNew && <Badge variant="new">New</Badge>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-6">
              {/* <UpgradeCard /> */}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
