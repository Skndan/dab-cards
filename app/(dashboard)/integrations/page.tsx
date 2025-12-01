import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { integrations } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUrl } from '@/lib/integrations/google-contacts';

export default async function IntegrationsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user.sub),
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const userIntegrations = await db.query.integrations.findMany({
    where: eq(integrations.userId, user.id),
  });

  const googleContactsConnected = userIntegrations.some(
    (i) => i.type === 'google_contacts' && i.isActive
  );
  const notionConnected = userIntegrations.some((i) => i.type === 'notion' && i.isActive);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your favorite tools</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Google Contacts */}
        <div className="rounded-lg border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">Google Contacts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Automatically sync contacts to Google Contacts
              </p>
            </div>
            {googleContactsConnected ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                Connected
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                Not Connected
              </span>
            )}
          </div>
          <div className="mt-6">
            {googleContactsConnected ? (
              <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                Disconnect
              </button>
            ) : (
              <a
                href={getAuthUrl(session.user.sub)}
                className="inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Connect
              </a>
            )}
          </div>
        </div>

        {/* Notion */}
        <div className="rounded-lg border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">Notion</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a contact database in Notion
              </p>
            </div>
            {notionConnected ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                Connected
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                Not Connected
              </span>
            )}
          </div>
          <div className="mt-6">
            {notionConnected ? (
              <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                Disconnect
              </button>
            ) : (
              <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                Connect
              </button>
            )}
          </div>
        </div>

        {/* More integrations placeholders */}
        <div className="rounded-lg border border-dashed p-6">
          <h3 className="text-xl font-semibold text-muted-foreground">Google Sheets</h3>
          <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
        </div>

        <div className="rounded-lg border border-dashed p-6">
          <h3 className="text-xl font-semibold text-muted-foreground">Zapier</h3>
          <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </div>
  );
}

