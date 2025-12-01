"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
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
    // Wait for auth to finish loading before proceeding
    if (auth.isLoading) {
      return;
    }

    if (auth.isAuthenticated && auth.user) {
      // Fetch subscription data when user is authenticated
      const fetchSubscription = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/subscription`);
          setSubscription(response.data);
        } catch (error) {
          console.error('Failed to fetch subscription:', error);
        } finally {
          setIsLoading(false);
        }
      };
      // fetchSubscription();
    } else {
      // User is not authenticated and auth has finished loading
      setSubscription(null);
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