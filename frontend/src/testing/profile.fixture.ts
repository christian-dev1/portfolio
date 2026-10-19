import { Profile } from '../app/shared/profile/models/profile.model';

export const PROFILE_FIXTURE: Profile = {
  fullName: 'Noutchom Noumbiap Christian Luther',
  brand: 'LUCHRIST',
  photoUrl: '/images/photo-test.jpg',
  socialLinks: [
    { network: 'github', url: 'https://github.com/example' },
    { network: 'gitlab', url: 'https://gitlab.com/example' },
    { network: 'linkedin', url: '' },
    { network: 'email', url: 'contact@example.com' },
  ],
  slogan: { fr: 'Slogan en français.', en: 'Slogan in English.' },
  description: { fr: 'Description en français.', en: 'Description in English.' },
};
