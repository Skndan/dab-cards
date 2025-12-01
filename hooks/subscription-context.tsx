"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { KeycloakUser } from "@/lib/auth/keycloak";
import axios from "axios";

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: null,
  isLoading: true,
});

export function SubscriptionProvider({ children }: React.PropsWithChildren) {
  const auth = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      // Fetch subscription data
      const fetchSubscription = async () => {
        try {
          const subscription = await axios.get(`/api/subscription`);
          setSubscription(subscription.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch subscription:', error);
          setIsLoading(false);
        }
      };
      fetchSubscription();
    } else if (!auth.isLoading) {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, auth.user, auth.isLoading]);

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