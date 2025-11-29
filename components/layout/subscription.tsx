"use client";
  
import { useSubscription } from "@/hooks/subscription-context";
import { Label } from "../ui/label";

export function Subscription() {
  // const { data: session } = useSession();
  // const user = session?.user.subscription;

  const { subscription, isLoading } = useSubscription();

  return <></>;
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <div className="hidden flex-row items-center gap-2 rounded-full border border-cyan-400 p-2 md:flex">
  //     <span className="relative flex size-3">
  //       <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-200 opacity-75"></span>
  //       <span className="relative inline-flex size-3 rounded-full bg-cyan-400"></span>
  //     </span>
  //     <Label>{subscription?.subscriptionId ? "Paid" : "Free"} Plan</Label> 
  //   </div>
  // );
}



// components/SubscriptionStatus.tsx
// "use client";

// import { useSubscription } from "@/context/SubscriptionContext";

// export function SubscriptionStatus() {
//   const { subscriptionLimit, isLoading } = useSubscription();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
    
//   );
// }