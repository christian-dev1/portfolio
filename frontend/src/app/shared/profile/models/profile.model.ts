import { LocalizedText } from '../../i18n/localized-text';

/** Réseaux autorisés, dans l'ordre d'affichage. */
export const SOCIAL_NETWORKS = [
  'linkedin',
  'github',
  'gitlab',
  'youtube',
  'tiktok',
  'facebook',
  'instagram',
  'snapchat',
  'email',
] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export interface SocialLink {
  network: SocialNetwork;
  /** URL https, ou adresse e-mail pour `email`. Vide = réseau non affiché. */
  url: string;
}

export const AVAILABILITY_STATUSES = ['open', 'remote-only', 'unavailable'] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export interface Availability {
  status: AvailabilityStatus;
  label: LocalizedText;
}

export interface ProfileValue {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
}

export interface SpokenLanguage {
  name: LocalizedText;
  level: LocalizedText;
}

export interface Company {
  name: string;
  role: LocalizedText;
  description: LocalizedText;
}

export interface Profile {
  fullName: string;
  brand: string;
  photoUrl: string;
  location: LocalizedText;
  availability: Availability;
  currentFocus: LocalizedText;
  socialLinks: SocialLink[];
  slogan: LocalizedText;
  description: LocalizedText;
  /** Paragraphes de présentation ; le premier sert de « Profil » dans le CV. */
  bio: LocalizedText[];
  values: ProfileValue[];
  qualities: LocalizedText[];
  interests: LocalizedText[];
  languages: SpokenLanguage[];
  company: Company;
  /** PDF du CV par langue ; chaîne vide = bouton de téléchargement masqué. */
  cvPdfUrl: LocalizedText;
  /** Réservés à l'espace CV ; vides = blocs masqués. */
  whatsapp: string;
  phones: string[];
}
