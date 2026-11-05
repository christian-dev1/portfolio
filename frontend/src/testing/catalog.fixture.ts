import { CareerEntry } from '../app/shared/career/models/career.model';
import { Project } from '../app/shared/projects/models/project.model';
import { Tool } from '../app/shared/tools/models/tool.model';

export const CAREER_FIXTURE: CareerEntry[] = [
  {
    id: 'example-degree',
    type: 'education',
    startYear: 2020,
    endYear: 2023,
    title: { fr: 'Formation', en: 'Education' },
    place: 'Example University',
    description: { fr: 'Description de formation.', en: 'Education description.' },
    visible: true,
  },
];

export const PROJECTS_FIXTURE: Project[] = [
  {
    id: 'example-project',
    name: 'Example project',
    summary: { fr: 'Résumé du projet.', en: 'Project summary.' },
    coverTagline: { fr: 'Accroche du projet.', en: 'Project tagline.' },
    highlights: [{ fr: 'Point fort.', en: 'Highlight.' }],
    context: 'collaboration',
    status: 'in-progress',
    roles: ['Backend'],
    technologies: ['Java'],
    repositoryUrl: 'https://example.com/project',
    coverUrl: '/images/projects/example-project.webp',
    visible: true,
    featured: false,
  },
];

export const AI_TOOLS_FIXTURE: Tool[] = [
  {
    id: 'claude',
    name: { fr: 'Claude', en: 'Claude' },
    monogram: 'CL',
    category: 'ai',
    usedIn: [],
    visible: true,
  },
  {
    id: 'chatgpt',
    name: { fr: 'ChatGPT', en: 'ChatGPT' },
    monogram: 'GP',
    category: 'ai',
    usedIn: [],
    visible: true,
  },
  {
    id: 'prompt-engineering',
    name: { fr: 'Prompt engineering', en: 'Prompt engineering' },
    monogram: 'PE',
    category: 'ai',
    usedIn: [],
    visible: true,
  },
  {
    id: 'n8n',
    name: { fr: 'n8n', en: 'n8n' },
    monogram: 'N8',
    category: 'ai',
    usedIn: [],
    visible: true,
  },
];

export const TOOLS_FIXTURE: Tool[] = [
  {
    id: 'java',
    name: { fr: 'Java', en: 'Java' },
    icon: 'openjdk',
    category: 'languages',
    usedIn: [{ fr: 'Projet exemple', en: 'Example project' }],
    visible: true,
  },
  ...AI_TOOLS_FIXTURE,
];
