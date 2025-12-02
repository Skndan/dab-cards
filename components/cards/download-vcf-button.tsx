"use client";

import { Download } from "lucide-react";
import { generateVCF } from "@/lib/generate-vcf";
import { toast } from "react-hot-toast";

interface DownloadVCFButtonProps {
  cardData: {
    name: string;
    title?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    profilePicture?: string;
  };
  slug: string;
}

export function DownloadVCFButton({ cardData, slug }: DownloadVCFButtonProps) {
  const handleDownload = () => {
    try {
      // Generate VCF content
      const vcfContent = generateVCF(cardData);

      // Create blob and download
      const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slug}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Contact downloaded successfully!');
    } catch (error) {
      console.error('Error downloading contact:', error);
      toast.error('Failed to download contact');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
    >
      <Download className="h-5 w-5" />
      Download Contact
    </button>
  );
}
