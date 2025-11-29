'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
    },
    payLinks: {
      upi: '',
      razorpay: '',
      dodopayments: '',
    },
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      font: 'Inter',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const { card } = await response.json();
      router.push(`/cards/${card.id}/edit`);
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Create New Card</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              type="url"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          
          <div>
            <label className="block text-sm font-medium">LinkedIn</label>
            <input
              type="url"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.socialLinks.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Twitter</label>
            <input
              type="url"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formData.socialLinks.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitter: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
}

