import { Profile } from '../app/shared/profile/models/profile.model';

export const PROFILE_FIXTURE: Profile = {
  fullName: 'Noutchom Noumbiap Christian Luther',
  brand: 'LUCHRIST',
  photoUrl: '/images/photo-test.jpg',
  location: { fr: 'Ville, Pays', en: 'City, Country' },
  availability: {
    status: 'remote-only',
    label: { fr: 'Disponible à distance', en: 'Available remotely' },
  },
  // 3 réseaux renseignés (GitHub, GitLab, e-mail) ; les tests qui ont besoin des autres les ajoutent.
  socialLinks: [
    { network: 'linkedin', url: '' },
    { network: 'github', url: 'https://github.com/example' },
    { network: 'gitlab', url: 'https://gitlab.com/example' },
    { network: 'youtube', url: '' },
    { network: 'email', url: 'contact@example.com' },
  ],
  slogan: { fr: 'Slogan en français.', en: 'Slogan in English.' },
  description: { fr: 'Description en français.', en: 'Description in English.' },
  bio: [
    { fr: 'Premier paragraphe.', en: 'First paragraph.' },
    { fr: 'Second paragraphe.', en: 'Second paragraph.' },
  ],
  values: [
    { id: 'dare', title: { fr: 'Oser', en: 'Dare' }, text: { fr: 'Texte.', en: 'Text.' } },
    {
      id: 'commitment',
      title: { fr: 'Engagement', en: 'Commitment' },
      text: { fr: 'Texte.', en: 'Text.' },
    },
  ],
  qualities: [{ fr: 'Travail en équipe', en: 'Teamwork' }],
  interests: [{ fr: 'Football', en: 'Football' }],
  languages: [{ name: { fr: 'Français', en: 'French' }, level: { fr: 'Courant', en: 'Fluent' } }],
  company: {
    name: 'B-HER EMPIRE',
    role: { fr: 'Fondateur', en: 'Founder' },
    description: { fr: 'Description de la société.', en: 'Company description.' },
  },
  cvPdfUrl: { fr: '', en: '' },
};
