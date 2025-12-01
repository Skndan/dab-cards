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

      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar links={filteredLinks} />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
            <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
              <MobileSheetSidebar links={filteredLinks} />

              {/* <div className="w-full flex-1">
                <SearchCommand links={filteredLinks} />
              </div> */}

              <Subscription />
              {/* <FeedbackNavbarPill /> */}
              <ModeToggle />
              {/* <UserAccountNav /> */}
            </MaxWidthWrapper>
          </header>

          <main className="flex-1 p-4 xl:px-8">
            <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
              {children}
            </MaxWidthWrapper>
          </main>
        </div>
      </div>
    </SubscriptionProvider>
  );
}
