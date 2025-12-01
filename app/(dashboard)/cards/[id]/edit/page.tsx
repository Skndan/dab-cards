'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData>(initialCardData);

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

      const { card } = await response.json();
      
      toast.success('Card created successfully!', {
        position: 'top-center',
      });
      
      router.push(`/cards/${card.id}/edit`);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Panel (Left) */}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
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
