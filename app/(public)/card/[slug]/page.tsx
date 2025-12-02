import { db } from '@/src/db/client';
import { cards } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Phone, Mail, Globe, MapPin, Building2, Share2 } from 'lucide-react';
import { DownloadVCFButton } from '@/components/cards/download-vcf-button';
import { Icons } from '@/components/shared/icons';
import { CardContentItem, LinkItem, LinkCollection, ImageConfig, CardTheme } from '@/types/card';

export default async function PublicCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await db.query.cards.findFirst({
    where: eq(cards.slug, slug),
  });

  if (!card || !card.isActive) {
    notFound();
  }

  // Parse theme and content
  const theme = (card.theme as CardTheme) || {
    primaryColor: '#000000',
    secondaryColor: '#666666',
    backgroundColor: '#ffffff',
    font: 'Inter',
    buttonStyle: 'rounded',
    profileLayout: 'classic',
  };

  const content = (card.content as CardContentItem[]) || [];

  // Helper to get image URL from ImageConfig or string
  const getImageUrl = (img: any): string | undefined => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    return img?.url;
  };

  const getImageStyle = (config: any) => {
    if (!config) return {};
    if (typeof config === 'string') return { backgroundImage: `url(${config})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {
      backgroundImage: `url(${config.url})`,
      backgroundSize: `${config.zoom * 100}%`,
      backgroundPosition: `${config.x}% ${config.y}%`
    };
  };

  const profileImageUrl = getImageUrl(card.profileImage);
  const coverImageUrl = getImageUrl(card.coverImage);
  const companyLogoUrl = getImageUrl(card.companyLogo);
  const hasProfileImage = !!profileImageUrl;
  const hasCoverImage = !!coverImageUrl;
  const hasCompanyLogo = !!companyLogoUrl;

  const getButtonStyle = () => {
    switch (theme.buttonStyle) {
      case 'square': return 'rounded-none';
      case 'pill': return 'rounded-full';
      case 'outline': return 'rounded-xl border-2 bg-transparent';
      default: return 'rounded-xl';
    }
  };

  const renderLinkIcon = (link: LinkItem) => {
    if (link.useCustomIcon) {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors text-xl">
          {link.icon || '🔗'}
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors p-2">
        <Image src="/google-icon.svg" alt={link.platform} width={40} height={40} className="h-full w-full object-contain" />
      </div>
    );
  };

  const renderLink = (link: LinkItem) => (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md ${getButtonStyle()}`}
      style={{
        borderColor: theme.buttonStyle === 'outline' ? theme.primaryColor : undefined,
        color: theme.buttonStyle === 'outline' ? theme.primaryColor : undefined
      }}
    >
      <div className="flex items-center gap-3 w-full">
        {link.thumbnailUrl ? (
          <img src={link.thumbnailUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
        ) : renderLinkIcon(link)}
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
    <div
      className="min-h-screen bg-white py-8 px-4"
      style={{
        fontFamily: `'${theme.font}', sans-serif`,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {theme.backgroundImageUrl && (
        <div
          className="fixed inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url(${theme.backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Main Content Card */}
        <div className={`bg-white shadow-xl rounded-2xl overflow-hidden`}>
          {/* Cover Image */}
          {hasCoverImage && (
            <div
              className="h-48 w-full bg-gray-200"
              style={{
                backgroundColor: theme.primaryColor,
                ...getImageStyle(card.coverImage)
              }}
            />
          )}
          <div className={`px-6 ${theme.profileLayout === 'left' || theme.profileLayout === 'compact' ? 'text-left' : 'text-center'}`}
            style={{
              marginTop: hasCoverImage ?
                (theme.profileLayout === 'compact' ? '-2rem' : '-3rem') :
                (theme.profileLayout === 'compact' ? '0.75rem' : '1.5rem')
            }}>

            {/* Profile Images */}
            {(hasProfileImage || hasCompanyLogo) && (
              <div className={`relative flex items-end ${theme.profileLayout === 'left' || theme.profileLayout === 'compact' ? 'justify-between' : 'justify-center'} ${theme.profileLayout === 'compact' ? 'mb-2' : ''} ${hasProfileImage && hasCompanyLogo ? 'gap-4' : 'gap-3'}`}>

                <div className="flex items-end gap-3">
                  {hasProfileImage && (
                    <div className={`relative ${theme.profileLayout === 'compact' ? 'h-16 w-16' :
                      theme.profileLayout === 'minimal' ? 'h-20 w-20' :
                        'h-24 w-24'
                      } overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md`}>
                      <div className="h-full w-full" style={getImageStyle(card.profileImage)} />
                    </div>
                  )}

                  {hasCompanyLogo && !hasProfileImage && (
                    <div className={`relative ${theme.profileLayout === 'compact' ? 'h-16 w-16' : 'h-24 w-24'} overflow-hidden rounded-lg border-4 border-white bg-white shadow-md p-2`}>
                      <div className="h-full w-full" style={getImageStyle(card.companyLogo)} />
                    </div>
                  )}
                </div>

                {hasCompanyLogo && hasProfileImage && (
                  <div className={`relative ${theme.profileLayout === 'compact' ? 'h-14 w-14' : 'h-20 w-20'} overflow-hidden rounded-lg border-2 border-white bg-white shadow-md p-2`}>
                    <div className="h-full w-full" style={getImageStyle(card.companyLogo)} />
                  </div>
                )}
              </div>
            )}

            {/* Name and Title */}
            <div className={`${theme.profileLayout === 'compact' ? 'mt-2 space-y-0.5' : 'mt-3 space-y-1'}`}>
              <h1 className={`${theme.profileLayout === 'compact' ? 'text-lg' :
                theme.profileLayout === 'minimal' ? 'text-2xl' :
                  theme.profileLayout === 'modern' ? 'text-2xl tracking-tight' :
                    'text-xl'
                } font-bold text-gray-900`}>{card.name}</h1>

              {(card.title || card.company) && (
                <div className={`flex flex-col ${theme.profileLayout === 'left' || theme.profileLayout === 'compact' ? 'items-start' : 'items-center'} ${theme.profileLayout === 'compact' ? 'text-xs' :
                  theme.profileLayout === 'modern' ? 'text-base' :
                    'text-sm'
                  } text-gray-600 ${theme.profileLayout === 'minimal' ? 'gap-1' : ''}`}>
                  {card.title && <span className={`font-medium ${theme.profileLayout === 'modern' ? 'text-gray-800' : ''}`}>{card.title}</span>}
                  {card.company && (
                    <span className="flex items-center gap-1 opacity-80">
                      <Building2 className="h-3 w-3" />
                      {card.company}
                    </span>
                  )}
                </div>
              )}

              {card.bio && (
                <p className={`${theme.profileLayout === 'compact' ? 'mt-1 text-xs' :
                  theme.profileLayout === 'minimal' ? 'mt-3 text-sm' :
                    'mt-2 text-sm'
                  } text-gray-600 max-w-[480px] ${theme.profileLayout === 'left' || theme.profileLayout === 'compact' ? '' : 'mx-auto'} ${theme.profileLayout === 'minimal' ? 'leading-relaxed' : ''}`}>{card.bio}</p>
              )}
            </div>

            {/* Location */}
            {card.location && (
              <div className={`${theme.profileLayout === 'compact' ? 'mt-2' : 'mt-4'} flex flex-wrap gap-3 ${theme.profileLayout === 'compact' ? 'text-[10px]' : 'text-xs'} text-gray-500 ${theme.profileLayout === 'left' || theme.profileLayout === 'compact' ? 'justify-start' : 'justify-center'}`}>
                <span className="flex items-center gap-1">
                  <MapPin className={`${theme.profileLayout === 'compact' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} /> {card.location}
                </span>
              </div>
            )}
          </div>

          {/* Contact Action Buttons */}
          <div className={`${theme.profileLayout === 'compact' ? 'mt-3' :
            theme.profileLayout === 'minimal' ? 'mt-8' :
              'mt-6'
            } flex justify-center gap-4 px-6`}>
            {card.email && (
              <a href={`mailto:${card.email}`} className={`flex ${theme.profileLayout === 'compact' ? 'h-8 w-8' :
                theme.profileLayout === 'modern' ? 'h-12 w-12' :
                  'h-10 w-10'
                } items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm`}>
                <Mail className={`${theme.profileLayout === 'compact' ? 'h-4 w-4' :
                  theme.profileLayout === 'modern' ? 'h-6 w-6' :
                    'h-5 w-5'
                  }`} />
              </a>
            )}
            {card.phone && (
              <a href={`tel:${card.phone}`} className={`flex ${theme.profileLayout === 'compact' ? 'h-8 w-8' :
                theme.profileLayout === 'modern' ? 'h-12 w-12' :
                  'h-10 w-10'
                } items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm`}>
                <Phone className={`${theme.profileLayout === 'compact' ? 'h-4 w-4' :
                  theme.profileLayout === 'modern' ? 'h-6 w-6' :
                    'h-5 w-5'
                  }`} />
              </a>
            )}
            {card.website && (
              <a href={card.website} target="_blank" rel="noopener noreferrer" className={`flex ${theme.profileLayout === 'compact' ? 'h-8 w-8' :
                theme.profileLayout === 'modern' ? 'h-12 w-12' :
                  'h-10 w-10'
                } items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 shadow-sm`}>
                <Globe className={`${theme.profileLayout === 'compact' ? 'h-4 w-4' :
                  theme.profileLayout === 'modern' ? 'h-6 w-6' :
                    'h-5 w-5'
                  }`} />
              </a>
            )}
          </div>

          {/* Download Contact Button */}
          <div className="mt-6 px-6">
            <DownloadVCFButton
              cardData={{
                name: card.name,
                title: card.title || undefined,
                company: card.company || undefined,
                email: card.email || undefined,
                phone: card.phone || undefined,
                website: card.website || undefined,
                location: card.location || undefined,
                profilePicture: profileImageUrl,
              }}
              slug={slug}
            />
          </div>

          {/* Links and Collections */}
          {content.length > 0 && (
            <div className="mt-8 space-y-4 px-6 pb-8">
              {content.filter(item => item.active !== false).map((item) => {
                if (item.type === 'collection') {
                  return renderCollection(item);
                }
                return renderLink(item);
              })}
            </div>
          )}

          {/* QR Code Section */}
          {card.qrCodeUrl && (
            <div className="mt-8 border-t border-gray-100 px-6 py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Share This Card</h3>
                </div>
                <p className="text-sm text-gray-600">Scan to view on mobile</p>
                <div className="relative">
                  <img
                    src={card.qrCodeUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Powered by</span>
          <Icons.logo className="h-5 w-5" />
          <span className="font-semibold">DabCards</span>
        </div>
      </div>
    </div>
  );
}
