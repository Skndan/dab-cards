// Plan feature definitions and enforcement

export interface PlanLimits {
  maxCards: number;
  maxContacts: number;
  aiFeatures: boolean;
  integrations: boolean;
  analytics: boolean;
  teamFeatures: boolean;
  customDomain: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  trial: {
    maxCards: 5,
    maxContacts: 100,
    aiFeatures: true,
    integrations: true,
    analytics: true,
    teamFeatures: false,
    customDomain: false,
    whiteLabel: false,
    apiAccess: false,
  },
  starter: {
    maxCards: 5,
    maxContacts: 100,
    aiFeatures: true,
    integrations: true,
    analytics: true,
    teamFeatures: false,
    customDomain: false,
    whiteLabel: false,
    apiAccess: false,
  },
  pro: {
    maxCards: -1, // Unlimited
    maxContacts: -1, // Unlimited
    aiFeatures: true,
    integrations: true,
    analytics: true,
    teamFeatures: false,
    customDomain: false,
    whiteLabel: false,
    apiAccess: false,
  },
  team: {
    maxCards: -1, // Unlimited
    maxContacts: -1, // Unlimited
    aiFeatures: true,
    integrations: true,
    analytics: true,
    teamFeatures: true,
    customDomain: true,
    whiteLabel: false,
    apiAccess: false,
  },
  business: {
    maxCards: -1, // Unlimited
    maxContacts: -1, // Unlimited
    aiFeatures: true,
    integrations: true,
    analytics: true,
    teamFeatures: true,
    customDomain: true,
    whiteLabel: true,
    apiAccess: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.trial;
}

export function checkLimit(
  currentCount: number,
  limit: number
): { allowed: boolean; message?: string } {
  if (limit === -1) {
    return { allowed: true };
  }

  if (currentCount >= limit) {
    return {
      allowed: false,
      message: `You've reached your plan limit of ${limit}. Please upgrade to continue.`,
    };
  }

  return { allowed: true };
}

export async function enforceCardLimit(
  userId: string,
  plan: string,
  currentCardCount: number
): Promise<{ allowed: boolean; message?: string }> {
  const limits = getPlanLimits(plan);
  return checkLimit(currentCardCount, limits.maxCards);
}

export async function enforceContactLimit(
  userId: string,
  plan: string,
  currentContactCount: number
): Promise<{ allowed: boolean; message?: string }> {
  const limits = getPlanLimits(plan);
  return checkLimit(currentContactCount, limits.maxContacts);
}

export function canAccessFeature(plan: string, feature: keyof PlanLimits): boolean {
  const limits = getPlanLimits(plan);
  return Boolean(limits[feature]);
}

