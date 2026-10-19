import projects from '../../public/data/projects.json';
import tools from '../../public/data/tools.json';
import profile from '../../public/data/profile.json';
import { PROJECT_CONTEXTS, PROJECT_STATUSES } from '../app/shared/projects/models/project.model';
import { TOOL_CATEGORIES } from '../app/features/tools/models/tool.model';
import { SOCIAL_NETWORKS } from '../app/shared/profile/models/profile.model';
import { isBrandIconSlug } from '../app/shared/ui/brand-icons';

/**
 * Les types TypeScript ne vérifient pas les fichiers JSON chargés au runtime :
 * ce test garantit que les données respectent le contrat attendu par les modèles.
 */

const KEBAB_CASE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTPS_URL = /^https:\/\//;
const PROJECT_IMAGE = /^\/images\/projects\/[a-z0-9-]+\.(png|jpe?g|webp|svg)$/;

function expectUniqueKebabCaseIds(items: { id: string }[]): void {
  const ids = items.map((item) => item.id);

  expect(new Set(ids).size, 'ids must be unique').toBe(ids.length);
  for (const id of ids) {
    expect(id, `id "${id}" must be lowercase kebab-case`).toMatch(KEBAB_CASE_ID);
  }
}

function expectLocalizedText(text: unknown, where: string): void {
  const localized = text as { fr?: unknown; en?: unknown };

  for (const lang of ['fr', 'en'] as const) {
    const value = localized?.[lang];
    expect(typeof value, `${where}.${lang} must be a string`).toBe('string');
    expect((value as string).trim(), `${where}.${lang} must not be empty`).not.toBe('');
  }
}

function expectOneOf(value: string, allowed: readonly string[], where: string): void {
  expect(allowed, `${where} "${value}" is not allowed`).toContain(value);
}

describe('Data contract', () => {
  describe('projects.json', () => {
    it('should have unique lowercase kebab-case ids', () => {
      expectUniqueKebabCaseIds(projects);
    });

    it('should only use known statuses and contexts', () => {
      for (const project of projects) {
        expectOneOf(project.status, PROJECT_STATUSES, `${project.id}.status`);
        expectOneOf(project.context, PROJECT_CONTEXTS, `${project.id}.context`);
      }
    });

    it('should have a summary and a cover tagline in French and English', () => {
      for (const project of projects) {
        expectLocalizedText(project.summary, `${project.id}.summary`);
        expectLocalizedText(project.coverTagline, `${project.id}.coverTagline`);
      }
    });

    it('should serve covers and logos from the project images folder', () => {
      for (const project of projects) {
        const { coverUrl, logoUrl } = project as { coverUrl?: string; logoUrl?: string };
        for (const [field, url] of Object.entries({ coverUrl, logoUrl })) {
          if (url !== undefined) {
            expect(url, `${project.id}.${field}`).toMatch(PROJECT_IMAGE);
          }
        }
      }
    });

    it('should only use https repository links', () => {
      for (const project of projects) {
        const url = (project as { repositoryUrl?: string }).repositoryUrl;
        if (url !== undefined) {
          expect(url, `${project.id}.repositoryUrl`).toMatch(HTTPS_URL);
        }
      }
    });

    it('should have boolean visible and featured flags', () => {
      for (const project of projects) {
        expect(typeof project.visible, `${project.id}.visible`).toBe('boolean');
        expect(typeof project.featured, `${project.id}.featured`).toBe('boolean');
      }
    });
  });

  describe('tools.json', () => {
    it('should have unique lowercase kebab-case ids', () => {
      expectUniqueKebabCaseIds(tools);
    });

    it('should only use known categories', () => {
      for (const tool of tools) {
        expectOneOf(tool.category, TOOL_CATEGORIES, `${tool.id}.category`);
      }
    });

    it('should have a name and places of use in French and English', () => {
      for (const tool of tools) {
        expectLocalizedText(tool.name, `${tool.id}.name`);
        tool.usedIn.forEach((place, index) =>
          expectLocalizedText(place, `${tool.id}.usedIn[${index}]`),
        );
      }
    });

    it('should have either a known brand icon or a monogram', () => {
      for (const tool of tools) {
        const { icon, monogram } = tool as { icon?: string; monogram?: string };
        expect(
          (icon === undefined) !== (monogram === undefined),
          `${tool.id} must have exactly one of icon and monogram`,
        ).toBe(true);
        if (icon !== undefined) {
          expect(isBrandIconSlug(icon), `${tool.id}.icon "${icon}" is not in brand-icons.ts`).toBe(
            true,
          );
        }
        if (monogram !== undefined) {
          expect(monogram, `${tool.id}.monogram`).toMatch(/^[A-Z0-9]{2,3}$/);
        }
      }
    });

    it('should have a boolean visible flag', () => {
      for (const tool of tools) {
        expect(typeof tool.visible, `${tool.id}.visible`).toBe('boolean');
      }
    });
  });

  describe('profile.json', () => {
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
  });
});
