import career from '../../../public/data/career.json';
import { CAREER_ENTRY_TYPES } from '../../app/shared/career/models/career.model';
import { expectUniqueKebabCaseIds, expectLocalizedText, expectOneOf } from './contract-helpers';

describe('Data contract: career.json', () => {
  it('should have unique lowercase kebab-case ids', () => {
    expectUniqueKebabCaseIds(career);
  });

  it('should only use known entry types', () => {
    for (const entry of career) {
      expectOneOf(entry.type, CAREER_ENTRY_TYPES, `${entry.id}.type`);
    }
  });

  it('should never start after it ends', () => {
    for (const entry of career) {
      const { startYear } = entry as { startYear?: number };
      expect(Number.isInteger(entry.endYear), `${entry.id}.endYear`).toBe(true);
      if (startYear !== undefined) {
        expect(startYear, `${entry.id}.startYear`).toBeLessThanOrEqual(entry.endYear);
      }
    }
  });

  it('should have a title, a place and an optional description in French and English', () => {
    for (const entry of career) {
      expectLocalizedText(entry.title, `${entry.id}.title`);
      expect(entry.place.trim(), `${entry.id}.place`).not.toBe('');
      const { description } = entry as { description?: unknown };
      if (description !== undefined) {
        expectLocalizedText(description, `${entry.id}.description`);
      }
    }
  });

  it('should have a boolean visible flag', () => {
    for (const entry of career) {
      expect(typeof entry.visible, `${entry.id}.visible`).toBe('boolean');
    }
  });
});
