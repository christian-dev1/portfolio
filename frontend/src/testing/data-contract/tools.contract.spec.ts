import tools from '../../../public/data/tools.json';
import { TOOL_CATEGORIES } from '../../app/shared/tools/models/tool.model';
import { isBrandIconSlug } from '../../app/shared/ui/brand-icons';
import { expectUniqueKebabCaseIds, expectLocalizedText, expectOneOf } from './contract-helpers';

describe('Data contract: tools.json', () => {
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
