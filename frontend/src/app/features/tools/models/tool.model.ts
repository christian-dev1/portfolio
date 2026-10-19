import { LocalizedText } from '../../../shared/i18n/localized-text';
import { BrandIconSlug } from '../../../shared/ui/brand-icons';

/** Ordre d'affichage des catégories sur la page Boîte à outils. */
export const TOOL_CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'database',
  'testing',
  'environment',
] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export interface Tool {
  id: string;
  name: LocalizedText;
  /** Logo simple-icons (slug déclaré dans `shared/ui/brand-icons.ts`)… */
  icon?: BrandIconSlug;
  /** …ou, à défaut de logo, un monogramme de 2 à 3 lettres. */
  monogram?: string;
  category: ToolCategory;
  usedIn: LocalizedText[];
  visible: boolean;
}
