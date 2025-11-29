// Dodopayments API integration

if (!process.env.DODOPAYMENTS_API_KEY) {
  throw new Error('DODOPAYMENTS_API_KEY is not set');
}

const DODOPAYMENTS_API_URL = 'https://api.dodopayments.com/v1';

export interface DodoPaymentProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
}

export const PLANS = {
  starter: {
    id: process.env.DODOPAYMENTS_STARTER_PRODUCT_ID || 'starter_product_id',
    name: 'Starter',
    price: 5,
    currency: 'USD',
    interval: 'month' as const,
    features: ['5 cards', 'AI enrichment', 'Basic integrations', '100 contacts'],
  },
  pro: {
    id: process.env.DODOPAYMENTS_PRO_PRODUCT_ID || 'pro_product_id',
    name: 'Pro',
    price: 12,
    currency: 'USD',
    interval: 'month' as const,
    features: ['Unlimited cards', 'All AI features', 'All integrations', 'Unlimited contacts'],
  },
  team: {
    id: process.env.DODOPAYMENTS_TEAM_PRODUCT_ID || 'team_product_id',
    name: 'Team',
    price: 25,
    currency: 'USD',
    interval: 'month' as const,
    features: ['5 users', 'Team features', 'Group cards', 'Advanced analytics'],
  },
  business: {
    id: process.env.DODOPAYMENTS_BUSINESS_PRODUCT_ID || 'business_product_id',
    name: 'Business',
    price: 15, // per user
    currency: 'USD',
    interval: 'month' as const,
    features: ['Unlimited users', 'White-label', 'API access', 'Priority support'],
  },
};

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

// Create payment link with PPP and trial period
export async function createCheckoutSession(
  plan: keyof typeof PLANS,
  userId: string,
  userEmail: string
): Promise<CheckoutSession> {
  try {
    const product = PLANS[plan];
    
    // Construct Dodopayments static payment link with parameters
    const baseUrl = 'https://checkout.dodopayments.com/buy';
    const url = new URL(`${baseUrl}/${product.id}`);
    
    // Add PPP and trial parameters
    url.searchParams.set('quantity', '1');
    url.searchParams.set('redirect_url', `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`);
    url.searchParams.set('email', userEmail);
    url.searchParams.set('metadata[userId]', userId);
    url.searchParams.set('metadata[plan]', plan);
    url.searchParams.set('trial_period_days', '30'); // 1-month free trial
    url.searchParams.set('ppp_enabled', 'true'); // Enable PPP
    
    return {
      url: url.toString(),
      sessionId: `session_${Date.now()}`, // Placeholder
    };
  } catch (error) {
    console.error('Checkout session creation error:', error);
    throw new Error('Failed to create checkout session');
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Implement signature verification based on Dodopayments documentation
    // This is a placeholder - actual implementation depends on Dodopayments' webhook signature method
    return true;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

// Webhook event types
export type DodoPaymentWebhookEvent =
  | 'subscription.trial_started'
  | 'subscription.trial_ending'
  | 'subscription.trial_ended'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'payment.succeeded'
  | 'payment.failed';

export interface WebhookPayload {
  event: DodoPaymentWebhookEvent;
  data: {
    subscriptionId: string;
    customerId: string;
    status: string;
    metadata?: {
      userId?: string;
      plan?: string;
    };
    trialEnd?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  };
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${DODOPAYMENTS_API_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODOPAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return false;
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string): Promise<any> {
  try {
    const response = await fetch(`${DODOPAYMENTS_API_URL}/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DODOPAYMENTS_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return null;
  }
}

