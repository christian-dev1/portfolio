import { LocalizedText } from '../../i18n/localized-text';

export const PROJECT_CONTEXTS = ['b-her', 'collaboration'] as const;
export type ProjectContext = (typeof PROJECT_CONTEXTS)[number];

export const PROJECT_STATUSES = ['in-progress', 'pilot', 'completed', 'concept'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  summary: LocalizedText;
  /** Points forts affichés en liste à puces dans la carte et dans le CV. */
  highlights: LocalizedText[];
  context: ProjectContext;
  roles: string[];
  technologies: string[];
  status: ProjectStatus;
  repositoryUrl?: string;
  coverTagline: LocalizedText;
  /** Image de couverture ; sinon une couverture est générée (nom + accroche). */
  coverUrl?: string;
  /** Logo affiché dans l'emblème ; sinon les initiales. */
  logoUrl?: string;
  visible: boolean;
  featured: boolean;
}

/** Initiales affichées à défaut de logo : « Vesty Shop » → « VS ». */
export function projectInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}
