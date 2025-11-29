import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { contacts, cards } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.keycloakId, session.user.sub),
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const contact = await db.query.contacts.findFirst({
    where: and(eq(contacts.id, params.id), eq(contacts.userId, user.id)),
    with: {
      sourceCard: true,
    },
  });

  if (!contact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/contacts" className="text-sm text-muted-foreground hover:underline">
            ← Back to contacts
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{contact.name}</h1>
          <p className="text-muted-foreground">{contact.jobTitle || 'No title'}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            Edit
          </button>
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
          <div className="space-y-3">
            {contact.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.company && (
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p>{contact.company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Source Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Source</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Captured From</p>
              <p>{contact.sourceCard?.name || 'Direct'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{new Date(contact.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {contact.notes && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Notes</h2>
          <p className="text-gray-600">{contact.notes}</p>
        </div>
      )}

      {/* AI Summary Placeholder */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">AI Summary</h2>
        <p className="text-muted-foreground">AI enrichment will appear here after processing...</p>
      </div>

      {/* Follow-up Actions */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Follow-up Actions</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            Generate Follow-up
          </button>
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            Add to Sequence
          </button>
        </div>
      </div>
    </div>
  );
}

