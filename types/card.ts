export type SocialPlatform =
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'github'
  | 'website'
  | 'email'
  | 'phone'
  | 'custom';

export interface LinkItem {
  id: string;
  type: 'link';
  platform: SocialPlatform;
  title: string;
  url: string;
  thumbnailUrl?: string;
  icon?: string; // Emoji or SVG URL
  useCustomIcon?: boolean; // If true, use 'icon' field. If false, use default platform icon.
  active: boolean;
  schedule?: {
    startDate?: Date;
    endDate?: Date;
  };
  displayMode?: 'default' | 'featured' | 'thumbnail';
}

export interface LinkCollection {
  id: string;
  type: 'collection';
  title: string;
  layout: 'list' | 'grid' | 'carousel';
  links: LinkItem[];
  active: boolean;
}

export type CardContentItem = LinkItem | LinkCollection;

export type ProfileLayout = 'classic' | 'modern' | 'minimal' | 'left';

export interface ImageConfig {
  url: string;
  zoom: number;
  x: number;
  y: number;
}

export interface CardTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  backgroundImageUrl?: string;
  font: string;
  buttonStyle: 'rounded' | 'square' | 'pill' | 'outline';
  profileLayout: ProfileLayout;
}

export interface CardData {
  // Profile
  profileImage?: string | ImageConfig;
  coverImage?: string | ImageConfig;
  companyLogo?: string | ImageConfig;

  name: string;
  title: string; // Job Title
  department?: string;
  company?: string;
  bio: string;

  // Contact (Sticky/Header)
  email?: string;
  phone?: string;
  website?: string;
  location?: string;

  // Content
  content: CardContentItem[];

  // Appearance
  theme: CardTheme;
}
