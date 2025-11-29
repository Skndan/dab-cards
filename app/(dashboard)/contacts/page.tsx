import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { contacts, cards } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function ContactsPage() {
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

  const userContacts = await db.query.contacts.findMany({
    where: eq(contacts.userId, user.id),
    orderBy: (contacts, { desc }) => [desc(contacts.createdAt)],
    with: {
      sourceCard: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your captured contacts</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="search"
          placeholder="Search contacts..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Categories</option>
          <option>Lead</option>
          <option>Client</option>
          <option>Recruiter</option>
          <option>Investor</option>
        </select>
        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Cards</option>
        </select>
      </div>

      {/* Contacts Table */}
      {userContacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No contacts yet. Share your card to start capturing leads!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {userContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {contact.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {contact.email || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {contact.company || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {contact.sourceCard?.name || 'Direct'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

