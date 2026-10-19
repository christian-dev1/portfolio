import { LocalizedText } from '../../i18n/localized-text';

export interface ProfileLinks {
  gitlab: string;
  github: string;
}

export interface Profile {
  fullName: string;
  brand: string;
  photoUrl: string;
  email: string;
  links: ProfileLinks;
  slogan: LocalizedText;
  description: LocalizedText;
}
