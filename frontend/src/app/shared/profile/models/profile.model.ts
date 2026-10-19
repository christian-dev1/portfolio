import { LocalizedText } from '../../i18n/localized-text';

/** Réseaux autorisés, dans l'ordre où ils peuvent apparaître. */
export const SOCIAL_NETWORKS = [
  'github',
  'gitlab',
  'linkedin',
  'facebook',
  'youtube',
  'tiktok',
  'email',
] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export interface SocialLink {
  network: SocialNetwork;
  /** URL https, ou adresse e-mail pour `email`. Vide = réseau non affiché. */
  url: string;
}

export interface Profile {
  fullName: string;
  brand: string;
  photoUrl: string;
  socialLinks: SocialLink[];
  slogan: LocalizedText;
  description: LocalizedText;
}
