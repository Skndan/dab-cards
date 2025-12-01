import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { cards } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const userCards = await db.query.cards.findMany({
    where: eq(cards.userId, session.user.sub),
    orderBy: (cards, { desc }) => [desc(cards.createdAt)],
  });

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <Link
          href="/cards/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Card
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Cards</h3>
          <p className="mt-2 text-3xl font-bold">{userCards.length}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Contacts</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Your Cards</h2>
        {userCards.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No cards yet. Create your first card!</p>
            <Link
              href="/cards/new"
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Card
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCards.map((card) => (
              <div key={card.id} className="rounded-lg border p-6">
                <h3 className="font-bold">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/cards/${card.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/card/${card.slug}`}
                    target="_blank"
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

