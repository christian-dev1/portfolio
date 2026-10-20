import { LocalizedText } from '../../i18n/localized-text';

export const CAREER_ENTRY_TYPES = ['education', 'experience'] as const;
export type CareerEntryType = (typeof CAREER_ENTRY_TYPES)[number];

export interface CareerEntry {
  id: string;
  type: CareerEntryType;
  /** Absente pour un diplôme obtenu une année donnée. */
  startYear?: number;
  endYear: number;
  title: LocalizedText;
  place: string;
  description?: LocalizedText;
  visible: boolean;
}
