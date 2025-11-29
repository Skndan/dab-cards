import { NavMobile } from "@/components/layout/mobile-nav-server";
import { NavBarServer } from "@/components/layout/navbar-server";
import { SiteFooter } from "@/components/layout/site-footer";
import { Label } from "@/components/ui/label";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBarServer scroll={true} />
      <div className="flex justify-center bg-green-200 p-1 dark:bg-green-700">
        <Label className="text-center">RepoVox is under Beta!💚 Please reach out to repovox.official@gmail.com for queries😁</Label>
      </div>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
