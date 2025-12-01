export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export interface CardTheme {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  backgroundColor: string;
}

export interface CardData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  avatarUrl?: string;
  coverUrl?: string;
  socialLinks: SocialLink[];
  theme: CardTheme;
}
