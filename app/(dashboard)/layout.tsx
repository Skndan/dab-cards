// import { redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth/session';

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getSession();

//   if (!session) {
//     redirect('/login');
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b">
//         <div className="flex h-16 items-center px-4">
//           <div className="ml-auto flex items-center space-x-4">
//             <span className="text-sm text-muted-foreground">
//               {session.user.name || session.user.email}
//             </span>
//             <form action="/api/auth/logout" method="GET">
//               <button
//                 type="submit"
//                 className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
//               >
//                 Logout
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <main className="container mx-auto py-6">{children}</main>
//     </div>
//   );
// }

import { redirect } from "next/navigation";

import { sidebarLinks } from "@/config/dashboard";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
// import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { SubscriptionProvider } from "@/hooks/subscription-context";
import { Subscription } from "@/components/layout/subscription";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/auth/session";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavBreadcrumb } from "@/components/layout/nav-breadcrumb";
// import { FeedbackNavbarPill } from "@/components/dashboard/feedback-nav-pill";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const filteredLinks = sidebarLinks;
  // .map((section) => ({
  //   ...section,
  //   items: section.items.filter(
  //     ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
  //   ),
  // })); 
  return (
    <SubscriptionProvider>

      {/* <div className="flex justify-center bg-green-200 p-1 dark:bg-green-700">
        <Label className="text-center">RepoVox is under Beta!💚 Please reach out to repovox.official@gmail.com for queries😁</Label>
      </div> */}

      <SidebarProvider>
        <DashboardSidebar links={filteredLinks} />

        <SidebarInset className="w-full overflow-hidden">
          <div className="sticky top-0 z-10">
            <header className="flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-2 backdrop-blur-sm sm:h-16 sm:px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-0.5 sm:-ml-1 text-foreground" />
                <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
                <NavBreadcrumb className="hidden sm:flex" />
              </div>
              <div className="ml-auto flex flex-1 space-x-2  sm:px-2 lg:max-w-lg justify-end">
                {/* <Search /> */}
                <ThemeToggle />
              </div>
            </header>
          </div>

          <ScrollArea className="flex h-[calc(100vh-5rem)] flex-col gap-4   pt-0 sm:h-[calc(100vh-5rem)]">
            <div className="p-4 sm:py-4">
              {children}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </SubscriptionProvider>
  );
}
