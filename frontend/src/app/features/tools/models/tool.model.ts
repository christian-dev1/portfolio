import { LocalizedText } from '../../../shared/i18n/localized-text';

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
  category: ToolCategory;
  usedIn: LocalizedText[];
  visible: boolean;
}
