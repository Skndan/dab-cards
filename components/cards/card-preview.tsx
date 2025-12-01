"use client";

import { CardData } from "@/types/card";
import { Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CardPreviewProps {
  data: CardData;
}

export function CardPreview({ data }: CardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const padding = 64; // p-8 * 2
      const availableWidth = width - padding;
      const availableHeight = height - padding;

      const baseWidth = 375;
      const baseHeight = 800;

      // Calculate scale to fit both dimensions
      const scaleX = availableWidth / baseWidth;
      const scaleY = availableHeight / baseHeight;

      // Use the smaller scale to ensure it fits, maxing out at 1
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-muted/50 p-8 overflow-hidden">
      <div
        className="relative h-[800px] w-[375px] shrink-0 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-white shadow-2xl transition-transform duration-200 ease-out origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-gray-900"></div>

        {/* Content */}
        <div className="h-full overflow-y-auto bg-white scrollbar-hide" style={{ fontFamily: data.theme.font }}>
          {/* Cover Image */}
          <div className="h-32 w-full bg-gray-200" style={{ backgroundColor: data.theme.primaryColor }}>
            {data.coverUrl && <img src={data.coverUrl} alt="Cover" className="h-full w-full object-cover" />}
          </div>

          {/* Profile Image */}
          <div className="relative -mt-12 px-6 text-center">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt={data.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-2xl font-bold text-gray-400">
                  {data.name ? data.name.charAt(0) : "?"}
                </div>
              )}
            </div>

            <h1 className="mt-3 text-xl font-bold text-gray-900">{data.name || "Your Name"}</h1>
            <p className="text-sm text-gray-500">{data.title || "Job Title"}</p>
            <p className="mt-2 text-sm text-gray-600">{data.bio || "Add a bio to tell people about yourself."}</p>
          </div>

          {/* Contact Actions */}
          <div className="mt-6 flex justify-center gap-4 px-6">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200">
                <Mail className="h-5 w-5" />
              </a>
            )}
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200">
                <Phone className="h-5 w-5" />
              </a>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Links */}
          <div className="mt-8 space-y-3 px-6 pb-8">
            {data.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {/* Icon placeholder */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{link.platform || "Link"}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
