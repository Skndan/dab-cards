"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { marketingConfig } from "@/config/marketing";
import { Icons } from "@/components/shared/icons";

interface ClientNavBarProps {
  scroll?: boolean;
  large?: boolean;
  children?: React.ReactNode;
}

export function ClientNavBar({ scroll = false, children }: ClientNavBarProps) {
  const scrolled = useScroll(50);

  const links = marketingConfig.mainNav;

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={false}
      >
        <div className="flex w-full items-center justify-between">
          {/* Left-aligned logo */}
          <Link href="/" className="flex items-center space-x-1.5">
            <Icons.logo className="size-6" />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          {/* Centered navigation links */}
          {links && links.length > 0 ? (
            <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    "text-foreground",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {children}
      </MaxWidthWrapper>
    </header>
  );
}