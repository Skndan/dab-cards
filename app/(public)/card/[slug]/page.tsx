import { db } from '@/src/db/client';
import { cards } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  [key: string]: string | undefined;
}

interface PayLinks {
  upi?: string;
  razorpay?: string;
  dodopayments?: string;
  [key: string]: string | undefined;
}

export default async function PublicCardPage({ params }: { params: { slug: string } }) {
  const card = await db.query.cards.findFirst({
    where: eq(cards.slug, params.slug),
  });

  if (!card || !card.isActive) {
    notFound();
  }

  const socialLinks = (card.socialLinks as SocialLinks | null) || ({} as SocialLinks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Banner */}
          {card.coverImage && (
            <div className="relative h-48 w-full bg-gradient-to-r from-primary to-primary/80">
              <Image
                src={card.coverImage}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Profile */}
            <div className="flex items-start gap-6">
              {card.profilePicture && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image
                    src={card.profilePicture}
                    alt={card.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{card.name}</h1>
                {card.title && (
                  <p className="mt-1 text-lg text-muted-foreground">{card.title}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            {card.bio && (
              <p className="mt-6 text-gray-600">{card.bio}</p>
            )}

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm">📧</span>
                  <span>{card.email}</span>
                </a>
              )}
              {card.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm">📱</span>
                  <span>{card.phone}</span>
                </a>
              )}
              {card.website && (
                <a
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm">🌐</span>
                  <span>{card.website}</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(socialLinks.linkedin || socialLinks.twitter || socialLinks.github) && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                  Connect
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                    >
                      LinkedIn
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                    >
                      Twitter
                    </a>
                  )}
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* QR Code */}
            {card.qrCodeUrl && (
              <div className="mt-8 rounded-lg border p-6 text-center">
                <p className="mb-4 text-sm text-gray-600">Scan to save contact</p>
                <Image
                  src={card.qrCodeUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            )}

            {/* Contact Form */}
            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-xl font-semibold">Stay in Touch</h3>
              <form action="/api/contacts/capture" method="POST" className="space-y-4">
                <input type="hidden" name="cardId" value={card.id} />
                <div>
                  <label className="block text-sm font-medium">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

