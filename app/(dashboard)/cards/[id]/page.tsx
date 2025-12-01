'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CardData } from '@/types/card';
import { CardEditor } from '@/components/cards/card-editor';
import { CardPreview } from '@/components/cards/card-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

const initialCardData: CardData = {
  name: '',
  title: '',
  bio: '',
  content: [],
  theme: {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    backgroundColor: '#ffffff',
    font: 'Inter',
    buttonStyle: 'rounded',
    profileLayout: 'classic',
  },
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [cardData, setCardData] = useState<CardData>(initialCardData);

  useEffect(() => {
    const fetchCardData = async (id: string) => {

      if (id === 'new') {
        setFetching(false);
        return;
      }

      // Validate UUID format
      if (!isValidUUID(id)) {
        toast.error('Invalid card ID format', {
          position: 'top-center',
        });
        router.replace('/cards/new');
        return;
      }

      try {
        const response = await fetch(`/api/cards/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Card not found', {
              position: 'top-center',
            });
            router.replace('/cards/new');
            return;
          }
          throw new Error('Failed to fetch card');
        }

        const { card } = await response.json();

        // Map database schema to CardData format
        const cardDataFromDB: CardData = {
          name: card.name || '',
          title: card.title || '',
          bio: card.bio || '',
          email: card.email,
          phone: card.phone,
          website: card.website,
          cardName: card.cardName,
          company: card.company,
          department: card.department,
          location: card.location,
          profileImage: card.profileImage,
          coverImage: card.coverImage,
          companyLogo: card.companyLogo,
          content: card.content || [],
          theme: card.theme || initialCardData.theme,
        };

        setCardData(cardDataFromDB);
      } catch (error) {
        console.error('Error fetching card:', error);
        toast.error('Failed to load card. Redirecting...', {
          position: 'top-center',
        });
        router.replace('/cards/new');
      } finally {
        setFetching(false);
      }
    };

    fetchCardData(id);
  }, [id, router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Map CardData to API payload matching database schema
      const payload = {
        name: cardData.name,
        title: cardData.title,
        bio: cardData.bio,
        email: cardData.email,
        phone: cardData.phone,
        website: cardData.website,
        cardName: cardData.cardName,
        company: cardData.company,
        department: cardData.department,
        location: cardData.location,
        profileImage: cardData.profileImage,
        coverImage: cardData.coverImage,
        companyLogo: cardData.companyLogo,
        content: cardData.content,
        theme: cardData.theme,
      };

      console.log(payload);


      if (id === "new") {

        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create card');
        }

        return;
      }

      const response = await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Card not found', {
            position: 'top-center',
          });
          router.replace('/cards/new');
          return;
        }
        throw new Error('Failed to update card');
      }

      toast.success('Card updated successfully!', {
        position: 'top-center',
      });

      // Stay on the edit page after successful update
      router.refresh();
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching card data
  if (fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Loading card...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen flex-col overflow-hidden bg-background">

        <div className="flex h-12 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{id === 'new' ? `Create Card` : `Edit Card`}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size={"sm"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} size={"sm"} loading={loading} loadingText='Saving...'>
              {'Save'}
            </Button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Panel (Left) */}
          <div className="w-1/2 overflow-y-auto border-r bg-background">
            <CardEditor data={cardData} onChange={setCardData} />
          </div>

          {/* Preview Panel (Right) */}
          <div className="w-1/2 bg-white">
            <CardPreview data={cardData} />
          </div>
        </div>
      </div>
    </>
  );
}
