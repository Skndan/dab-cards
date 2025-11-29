import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { subscriptions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/billing/dodopayments';

export default async function BillingPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.keycloakId, session.user.sub),
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, user.id),
  });

  // Calculate trial days left (server-side calculation)
  const now = new Date();
  const trialDaysLeft = subscription?.trialEndsAt
    ? Math.ceil((new Date(subscription.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Current Plan</h2>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{subscription.plan}</p>
              <p className="text-muted-foreground">
                Status: <span className="capitalize">{subscription.status}</span>
              </p>
              {subscription.status === 'trial' && (
                <p className="mt-2 text-sm text-yellow-600">
                  {trialDaysLeft > 0 ? `Trial ends in ${trialDaysLeft} days` : 'Trial has ended'}
                </p>
              )}
              {subscription.currentPeriodEnd && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {subscription.status === 'active' && (
              <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-lg border p-6 ${
                subscription?.plan === key ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
                {key === 'business' && (
                  <span className="text-sm text-muted-foreground"> per user</span>
                )}
              </div>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {subscription?.plan !== key && (
                <form action="/api/billing/checkout" method="POST" className="mt-6">
                  <input type="hidden" name="plan" value={key} />
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {subscription ? 'Upgrade' : 'Start Trial'}
                  </button>
                </form>
              )}
              {subscription?.plan === key && (
                <div className="mt-6 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
                  Current Plan
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trial Info */}
      {!subscription && (
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">🎉 Start Your Free Trial</h3>
          <p className="mt-2 text-sm text-blue-800">
            Get 1 month free trial on any plan. No credit card required. Cancel anytime.
          </p>
          <p className="mt-2 text-sm text-blue-700">
            <strong>PPP Enabled:</strong> Prices are automatically adjusted based on your country for fair pricing worldwide.
          </p>
        </div>
      )}
    </div>
  );
}

