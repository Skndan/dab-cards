import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, type WebhookPayload } from '@/lib/billing/dodopayments';
import { db } from '@/src/db/client';
import { subscriptions, users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-dodopayments-signature');
    const payload = await request.text();

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(payload, signature, process.env.DODOPAYMENTS_WEBHOOK_SECRET!)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: WebhookPayload = JSON.parse(payload);

    // Handle different webhook events
    switch (event.event) {
      case 'subscription.trial_started':
        await handleTrialStarted(event);
        break;

      case 'subscription.trial_ending':
        await handleTrialEnding(event);
        break;

      case 'subscription.trial_ended':
      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;

      case 'payment.succeeded':
        // Update subscription status
        break;

      case 'payment.failed':
        // Handle payment failure
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleTrialStarted(event: WebhookPayload) {
  const userId = event.data.metadata?.userId;
  const plan = event.data.metadata?.plan;

  if (!userId || !plan) return;

  const user = await db.query.users.findFirst({
    where: eq(users.keycloakId, userId),
  });

  if (!user) return;

  // Create or update subscription
  await db.insert(subscriptions).values({
    userId: user.id,
    plan,
    status: 'trial',
    dodopaymentSubscriptionId: event.data.subscriptionId,
    trialEndsAt: event.data.trialEnd ? new Date(event.data.trialEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    currentPeriodStart: new Date(),
    currentPeriodEnd: event.data.currentPeriodEnd ? new Date(event.data.currentPeriodEnd) : null,
  }).onConflictDoUpdate({
    target: subscriptions.userId,
    set: {
      plan,
      status: 'trial',
      dodopaymentSubscriptionId: event.data.subscriptionId,
      trialEndsAt: event.data.trialEnd ? new Date(event.data.trialEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  });
}

async function handleTrialEnding(event: WebhookPayload) {
  // Send reminder email 3 days before trial ends
  // TODO: Implement email notification
  console.log('Trial ending soon for subscription:', event.data.subscriptionId);
}

async function handleSubscriptionCreated(event: WebhookPayload) {
  const userId = event.data.metadata?.userId;
  const plan = event.data.metadata?.plan;

  if (!userId || !plan) return;

  const user = await db.query.users.findFirst({
    where: eq(users.keycloakId, userId),
  });

  if (!user) return;

  await db
    .update(subscriptions)
    .set({
      status: 'active',
      currentPeriodStart: event.data.currentPeriodStart ? new Date(event.data.currentPeriodStart) : new Date(),
      currentPeriodEnd: event.data.currentPeriodEnd ? new Date(event.data.currentPeriodEnd) : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, user.id));
}

async function handleSubscriptionUpdated(event: WebhookPayload) {
  const subscriptionRecord = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.dodopaymentSubscriptionId, event.data.subscriptionId),
  });

  if (!subscriptionRecord) return;

  await db
    .update(subscriptions)
    .set({
      status: event.data.status as any,
      currentPeriodStart: event.data.currentPeriodStart ? new Date(event.data.currentPeriodStart) : undefined,
      currentPeriodEnd: event.data.currentPeriodEnd ? new Date(event.data.currentPeriodEnd) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionRecord.id));
}

async function handleSubscriptionCancelled(event: WebhookPayload) {
  const subscriptionRecord = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.dodopaymentSubscriptionId, event.data.subscriptionId),
  });

  if (!subscriptionRecord) return;

  await db
    .update(subscriptions)
    .set({
      status: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionRecord.id));
}

