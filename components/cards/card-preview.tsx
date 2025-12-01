"use client";

import { CardData, CardContentItem, LinkItem, LinkCollection } from "@/types/card";
import { Phone, Mail, Globe, ExternalLink, MapPin, Building2 } from "lucide-react";
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
      const padding = 64;
      const availableWidth = width - padding;
      const availableHeight = height - padding;

      const baseWidth = 375;
      const baseHeight = 800;

      const scaleX = availableWidth / baseWidth;
      const scaleY = availableHeight / baseHeight;

      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Font loading logic
  useEffect(() => {
    if (data.theme.font) {
      const fontName = data.theme.font;
      const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [data.theme.font]);

  const getButtonStyle = () => {
    switch (data.theme.buttonStyle) {
      case 'square': return 'rounded-none';
      case 'pill': return 'rounded-full';
      case 'outline': return 'rounded-xl border-2 bg-transparent';
      default: return 'rounded-xl'; // rounded
    }
  };

  const renderLink = (link: LinkItem) => (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md ${getButtonStyle()}`}
      style={{
        borderColor: data.theme.buttonStyle === 'outline' ? data.theme.primaryColor : undefined,
        color: data.theme.buttonStyle === 'outline' ? data.theme.primaryColor : undefined
      }}
    >
      <div className="flex items-center gap-3 w-full">
        {link.thumbnailUrl ? (
          <img src={link.thumbnailUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors text-xl">
            {link.icon || '🔗'}
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <span className="block font-medium text-gray-900 truncate">{link.title}</span>
          {link.displayMode === 'featured' && link.url && (
            <span className="block text-xs text-gray-500 truncate">{link.url}</span>
          )}
        </div>
      </div>
    </a>
  );

  const renderCollection = (collection: LinkCollection) => (
    <div key={collection.id} className="space-y-3">
      <h3 className="font-semibold text-gray-900 px-1">{collection.title}</h3>
      {collection.layout === 'carousel' ? (
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x">
          {collection.links.map(link => (
            <div key={link.id} className="w-[280px] shrink-0 snap-center">
              {renderLink(link)}
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-3 ${collection.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {collection.links.map(link => renderLink(link))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-muted/50 p-8 overflow-hidden">
      <div
        className="relative h-[800px] w-[375px] shrink-0 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-white shadow-2xl transition-transform duration-200 ease-out origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-gray-900"></div>

        {/* Content Container */}
        <div
          className="h-full overflow-y-auto bg-white scrollbar-hide"
          style={{
            fontFamily: `'${data.theme.font}', sans-serif`,
            backgroundColor: data.theme.backgroundColor,
          }}
        >
          {/* Background Image Overlay */}
          {data.theme.backgroundImageUrl && (
            <div
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `url(${data.theme.backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}

          <div className="relative z-10">
            {/* Cover Image */}
            <div className="h-32 w-full bg-gray-200" style={{ backgroundColor: data.theme.primaryColor }}>
              {data.coverImage && <img src={data.coverImage} alt="Cover" className="h-full w-full object-cover" />}
            </div>

            {/* Profile Header */}
            <div className="relative -mt-12 px-6 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
                {data.profileImage ? (
                  <img src={data.profileImage} alt={data.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-2xl font-bold text-gray-400">
                    {data.name ? data.name.charAt(0) : "?"}
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-1">
                <h1 className="text-xl font-bold text-gray-900">{data.name || "Your Name"}</h1>

                {(data.title || data.company) && (
                  <div className="flex flex-col items-center text-sm text-gray-600">
                    {data.title && <span className="font-medium">{data.title}</span>}
                    {data.company && (
                      <span className="flex items-center gap-1 opacity-80">
                        {data.companyLogo && <img src={data.companyLogo} className="h-4 w-4 object-contain" alt="" />}
                        {data.company}
                      </span>
                    )}
                  </div>
                )}

                {data.bio && <p className="mt-2 text-sm text-gray-600 max-w-[280px] mx-auto">{data.bio}</p>}
              </div>

              {/* Location & Contact */}
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                {data.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {data.location}
                  </span>
                )}
              </div>
            </div>

            {/* Contact Actions (Sticky Bar style) */}
            <div className="mt-6 flex justify-center gap-4 px-6">
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm">
                  <Phone className="h-5 w-5" />
                </a>
              )}
              {data.website && (
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm">
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>

            {/* Content List */}
            <div className="mt-8 space-y-4 px-6 pb-12">
              {data.content.map((item) => {
                if (item.type === 'collection') {
                  return renderCollection(item);
                }
                return renderLink(item);
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
