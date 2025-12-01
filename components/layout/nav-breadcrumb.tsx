"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { sidebarLinks } from "@/config/dashboard"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types"

interface BreadcrumbItem {
  title: string
  href: string
  isLast: boolean
}

// Flatten the nested sidebarLinks structure into a single array of NavItems
const flattenMenuItems = (): NavItem[] => {
  const items: NavItem[] = []
  sidebarLinks.forEach((section) => {
    section.items.forEach((item) => {
      items.push(item)
    })
  })
  return items
}

export function NavBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const menuItems = React.useMemo(() => flattenMenuItems(), [])

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    // Find the menu item that matches the current pathname
    const currentItem = menuItems.find((item) => item.href === pathname)
    
    if (!currentItem) return []

    // For now, create a simple breadcrumb with just the current page
    // In a real implementation, you might want to parse the pathname to create parent breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: currentItem.title,
        href: currentItem.href,
        isLast: true,
      }
    ]

    return breadcrumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbs.map((item) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {!item.isLast ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
