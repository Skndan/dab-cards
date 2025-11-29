 

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { ClientNavBar } from "./client-navbar";

interface NavBarServerProps {
  scroll?: boolean;
  large?: boolean;
}

export async function NavBarServer({ scroll = false }: NavBarServerProps) {
  const session = await getSession();

  const authButton = session ? (
    <Link href={"/dashboard"} className="hidden md:block">
      <Button
        className="gap-2 px-5"
        variant="default"
        size="sm"
        rounded="full"
      >
        <span>Dashboard</span>
      </Button>
    </Link>
  ) : (
    <Link href={siteConfig.login} target="_self" rel="noreferrer">
      <Button
        className="hidden gap-2 px-5 md:flex"
        variant="default"
        size="sm"
        rounded="full"
      >
        <span>Sign In</span>
        <ArrowRight className="size-4" />
      </Button>
    </Link>
  );

  return (
    <ClientNavBar scroll={scroll}>
      <div className="flex shrink-0 items-center space-x-3">
        {authButton}
      </div>
    </ClientNavBar>
  );
}
