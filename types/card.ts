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
  icon?: string; // For custom icons
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

export interface CardTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  backgroundImageUrl?: string;
  font: string;
  buttonStyle: 'rounded' | 'square' | 'pill' | 'outline';
}

export interface CardData {
  // Profile
  profileImage?: string;
  coverImage?: string;
  companyLogo?: string;
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
