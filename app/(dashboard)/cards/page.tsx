'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ExternalLink, QrCode, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { CardPreview } from '@/components/cards/card-preview';
import { CardData, ProfileLayout } from '@/types/card';

// TypeScript types for API response
interface ImageConfig {
  url: string;
  zoom: number;
  x: number;
  y: number;
}

interface CardTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  font?: string;
  buttonStyle?: string;
  profileLayout?: string;
}

interface CardItem {
  id: string;
  userId: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  website?: string;
  cardName?: string;
  company?: string;
  department?: string;
  location?: string;
  profileImage?: ImageConfig;
  coverImage?: ImageConfig;
  companyLogo?: ImageConfig;
  content?: unknown;
  payLinks?: unknown;
  customFields?: unknown;
  theme?: CardTheme;
  isActive: boolean;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CardsResponse {
  cards: CardItem[];
}

interface ErrorResponse {
  error: string;
}

// Helper function to transform CardItem to CardData
const transformCardItemToCardData = (card: CardItem): CardData => {
  // Parse content if it's a string, otherwise use it as is
  let content = [];
  try {
    if (typeof card.content === 'string') {
      content = JSON.parse(card.content);
    } else if (Array.isArray(card.content)) {
      content = card.content;
    }
  } catch (e) {
    console.error('Failed to parse card content:', e);
  }

  return {
    cardName: card.cardName,
    profileImage: card.profileImage,
    coverImage: card.coverImage,
    companyLogo: card.companyLogo,
    name: card.name,
    title: card.title || '',
    department: card.department,
    company: card.company,
    bio: card.bio || '',
    email: card.email,
    phone: card.phone,
    website: card.website,
    location: card.location,
    content: content,
    theme: {
      primaryColor: card.theme?.primaryColor || '#3b82f6',
      secondaryColor: card.theme?.secondaryColor || '#8b5cf6',
      backgroundColor: card.theme?.backgroundColor || '#ffffff',
      backgroundImageUrl: card.theme?.backgroundImageUrl,
      font: card.theme?.font || 'Inter',
      buttonStyle: (card.theme?.buttonStyle as 'rounded' | 'square' | 'pill' | 'outline') || 'rounded',
      profileLayout: (card.theme?.profileLayout as ProfileLayout) || 'classic',
    },
  };
};

// Skeleton component for loading state
function CardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card">
      {/* Card Preview Skeleton */}
      <div className="h-[400px] bg-muted/30 relative">
        {/* Phone frame */}
        <div className="flex h-full w-full items-center justify-center p-8">
          <div className="relative h-full w-[280px] shrink-0 overflow-hidden rounded-[2.5rem] border-8 border-gray-200 bg-white">
            <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-200"></div>

            <div className="h-full overflow-hidden p-6 space-y-4">
              {/* Cover image skeleton */}
              <Skeleton className="h-24 w-full rounded-lg" />

              {/* Profile section */}
              <div className="flex flex-col items-center -mt-10 space-y-3">
                <Skeleton className="h-20 w-20 rounded-full border-4 border-white" />
                <div className="space-y-2 text-center w-full">
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
              </div>

              {/* Contact buttons */}
              <div className="flex justify-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              {/* Links skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Overlay Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/60 to-transparent p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 flex-1 bg-white/20" />
          <Skeleton className="h-9 w-9 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cards on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/cards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(errorData.error || 'Failed to fetch cards');
        }

        const data: CardsResponse = await response.json();
        setCards(data.cards);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Loading state with CardPreview skeletons
  if (loading) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Cards</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Cards</h1>
          <p className="text-muted-foreground">
            Manage your digital business cards
          </p>
        </div>
        <Button onClick={() => router.push('/cards/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Card
        </Button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg bg-linear-to-br from-muted/50 to-muted/30">
          <div className="text-center max-w-md space-y-6">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="relative">
                <CreditCard className="h-10 w-10 text-primary" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Create Your First Digital Card</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Transform your networking with a stunning digital business card. Share your contact info,
                social links, and portfolio instantly with anyone, anywhere.
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 gap-3 text-left text-sm">
              {[
                { icon: '✨', text: 'Beautiful, customizable designs' },
                { icon: '🔗', text: 'Add unlimited links and social profiles' },
                { icon: '📊', text: 'Track views and engagement' },
                { icon: '📱', text: 'Share via QR code or link' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-lg">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => router.push('/cards/new')}
                className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Create Your First Card
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
              Takes less than 2 minutes to set up
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/cards/${card.id}`)}
            >
              {/* Card Preview */}
              <div className="h-[400px] overflow-hidden bg-muted/30">
                <CardPreview data={transformCardItemToCardData(card)} />
              </div>

              {/* Card Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/60 to-transparent p-4 text-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{card.name}</h3>
                    {card.title && (
                      <p className="text-sm text-white/80 truncate">{card.title}</p>
                    )}
                  </div>
                  {!card.isActive && (
                    <span className="text-xs px-2 py-1 bg-white/20 rounded-md backdrop-blur-sm ml-2">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/cards/${card.id}`);
                    }}
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  {/* <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/card/${card.slug}`, '_blank');
                    }}
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View
                  </Button> */}
                  {card.qrCodeUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(card.qrCodeUrl, '_blank');
                      }}
                    >
                      <QrCode className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
