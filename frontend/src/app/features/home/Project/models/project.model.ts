export type ProjectContext = 'b-her' | 'collaboration';

export type ProjectStatus = 'in-progress' | 'completed' | 'concept';

export interface Project {
  id: string;
  name: string;
  summary: string;
  context: ProjectContext;
  roles: string[];
  technologies: string[];
  status: ProjectStatus;
  repositoryUrl?: string;
  imageUrl?: string;
  visible: boolean;
}