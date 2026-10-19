import { LocalizedText } from '../../i18n/localized-text';

export const PROJECT_CONTEXTS = ['b-her', 'collaboration'] as const;
export type ProjectContext = (typeof PROJECT_CONTEXTS)[number];

export const PROJECT_STATUSES = ['in-progress', 'pilot', 'completed', 'concept'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  summary: LocalizedText;
  context: ProjectContext;
  roles: string[];
  technologies: string[];
  status: ProjectStatus;
  repositoryUrl?: string;
  imageUrl?: string;
  visible: boolean;
  featured: boolean;
}
