export type ToolCategory =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'database'
  | 'testing'
  | 'environment';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  usedIn: string[];
  visible: boolean;
}

export const TOOL_CATEGORY_ORDER: ToolCategory[] = [
  'languages',
  'backend',
  'frontend',
  'database',
  'testing',
  'environment',
];

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  languages: 'Langages',
  backend: 'Backend',
  frontend: 'Frontend',
  database: 'Base de données',
  testing: 'Tests & QA',
  environment: 'Environnement & outils',
};