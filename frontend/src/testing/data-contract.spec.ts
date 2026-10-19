import projects from '../../public/data/projects.json';
import tools from '../../public/data/tools.json';
import { PROJECT_CONTEXTS, PROJECT_STATUSES } from '../app/features/projects/models/project.model';
import { TOOL_CATEGORIES } from '../app/features/tools/models/tool.model';

/**
 * Les types TypeScript ne vérifient pas les fichiers JSON chargés au runtime :
 * ce test garantit que les données respectent le contrat attendu par les modèles.
 */

const KEBAB_CASE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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

    it('should have a summary in French and English', () => {
      for (const project of projects) {
        expectLocalizedText(project.summary, `${project.id}.summary`);
      }
    });

    it('should only use https repository links', () => {
      for (const project of projects) {
        const url = (project as { repositoryUrl?: string }).repositoryUrl;
        if (url !== undefined) {
          expect(url, `${project.id}.repositoryUrl`).toMatch(/^https:\/\//);
        }
      }
    });

    it('should have a boolean visible flag', () => {
      for (const project of projects) {
        expect(typeof project.visible, `${project.id}.visible`).toBe('boolean');
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

    it('should have a boolean visible flag', () => {
      for (const tool of tools) {
        expect(typeof tool.visible, `${tool.id}.visible`).toBe('boolean');
      }
    });
  });
});
