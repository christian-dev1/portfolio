import profile from '../../../public/data/profile.json';
import {
  AVAILABILITY_STATUSES,
  SOCIAL_NETWORKS,
} from '../../app/shared/profile/models/profile.model';
import {
  EMAIL,
  HTTPS_URL,
  PDF_URL,
  expectUniqueKebabCaseIds,
  expectLocalizedText,
  expectOneOf,
} from './contract-helpers';

describe('Data contract: profile.json', () => {
  it('should have a non-empty full name and brand', () => {
    expect(profile.fullName.trim()).not.toBe('');
    expect(profile.brand.trim()).not.toBe('');
  });

  it('should have a slogan and a description in French and English', () => {
    expectLocalizedText(profile.slogan, 'profile.slogan');
    expectLocalizedText(profile.description, 'profile.description');
  });

  it('should only use known social networks, each at most once', () => {
    const networks = profile.socialLinks.map((link) => link.network);

    for (const network of networks) {
      expectOneOf(network, SOCIAL_NETWORKS, 'profile.socialLinks.network');
    }
    expect(new Set(networks).size, 'social networks must be unique').toBe(networks.length);
  });

  it('should have empty, https or valid email social links', () => {
    for (const { network, url } of profile.socialLinks) {
      if (url === '') {
        continue;
      }
      expect(url, `profile.socialLinks.${network}`).toMatch(
        network === 'email' ? EMAIL : HTTPS_URL,
      );
    }
  });

  it('should serve the photo from the images folder', () => {
    expect(profile.photoUrl).toMatch(/^\/images\//);
  });

  it('should have a location and a known availability', () => {
    expectLocalizedText(profile.location, 'profile.location');
    expectOneOf(profile.availability.status, AVAILABILITY_STATUSES, 'profile.availability');
    expectLocalizedText(profile.availability.label, 'profile.availability.label');
  });

  it('should have a bio of at least one paragraph, each in French and English', () => {
    expect(profile.bio.length).toBeGreaterThan(0);
    profile.bio.forEach((paragraph, index) =>
      expectLocalizedText(paragraph, `profile.bio[${index}]`),
    );
  });

  it('should have values with unique ids and texts in French and English', () => {
    expectUniqueKebabCaseIds(profile.values);
    for (const value of profile.values) {
      expectLocalizedText(value.title, `profile.values.${value.id}.title`);
      expectLocalizedText(value.text, `profile.values.${value.id}.text`);
    }
  });

  it('should have qualities, interests and languages in French and English', () => {
    const lists = { qualities: profile.qualities, interests: profile.interests };
    for (const [name, items] of Object.entries(lists)) {
      expect(items.length, `profile.${name}`).toBeGreaterThan(0);
      items.forEach((item, index) => expectLocalizedText(item, `profile.${name}[${index}]`));
    }
    profile.languages.forEach((language, index) => {
      expectLocalizedText(language.name, `profile.languages[${index}].name`);
      expectLocalizedText(language.level, `profile.languages[${index}].level`);
    });
  });

  it('should describe the company in French and English', () => {
    expect(profile.company.name.trim()).not.toBe('');
    expectLocalizedText(profile.company.role, 'profile.company.role');
    expectLocalizedText(profile.company.description, 'profile.company.description');
  });

  it('should have an empty or PDF CV link for each language', () => {
    for (const lang of ['fr', 'en'] as const) {
      const url = profile.cvPdfUrl[lang];
      if (url !== '') {
        expect(url, `profile.cvPdfUrl.${lang}`).toMatch(PDF_URL);
      }
    }
  });
});
