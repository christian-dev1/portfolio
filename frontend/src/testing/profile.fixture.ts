import { Profile } from '../app/shared/profile/models/profile.model';

export const PROFILE_FIXTURE: Profile = {
  fullName: 'Noutchom Noumbiap Christian Luther',
  brand: 'LUCHRIST',
  photoUrl: '/images/photo-test.jpg',
  email: 'contact@example.com',
  links: {
    gitlab: 'https://gitlab.com/example',
    github: 'https://github.com/example',
  },
  slogan: { fr: 'Slogan en français.', en: 'Slogan in English.' },
  description: { fr: 'Description en français.', en: 'Description in English.' },
};
