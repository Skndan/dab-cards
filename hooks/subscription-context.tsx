"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: null,
  isLoading: true,
});

export function SubscriptionProvider({ children }) {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch subscription data
      const fetchSubscription = async () => {
        const subscription = await axios.get(`/api/subscription`);
        setSubscription(subscription.data);
        setIsLoading(false);
      };
      fetchSubscription();
    }
  }, [session]);

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

export interface Subscription {
  id: string;
  userId: string;
  subscriptionId: string | null;
  planId: string | null;
  maxRepos: number;
  maxTriggers: number;
  maxIntegrations: number;
  allowCustomPrompts: boolean;
  allowScheduledPosting: boolean;
  byoAI: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionContextValue {
  subscription: Subscription | null;
  isLoading: boolean;
}