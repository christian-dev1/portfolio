import projects from '../../../public/data/projects.json';
import { PROJECT_CONTEXTS, PROJECT_STATUSES } from '../../app/shared/projects/models/project.model';
import {
  HTTPS_URL,
  PROJECT_IMAGE,
  expectUniqueKebabCaseIds,
  expectLocalizedText,
  expectOneOf,
} from './contract-helpers';

describe('Data contract: projects.json', () => {
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

  it('should have at least one highlight, each in French and English', () => {
    for (const project of projects) {
      expect(project.highlights.length, `${project.id}.highlights`).toBeGreaterThan(0);
      project.highlights.forEach((highlight, index) =>
        expectLocalizedText(highlight, `${project.id}.highlights[${index}]`),
      );
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
