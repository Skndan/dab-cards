'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      // API integration will be added later
      console.log('Saving card data:', cardData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Card saved! (Simulation)');
      // router.push(`/cards/${newId}/edit`);
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      {/* <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Create New Card</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Card
              </>
            )}
          </Button>
        </div>
      </header> */}

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
  );
}
