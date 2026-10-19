export interface NavItem {
  labelKey: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.projects', path: '/projets' },
  { labelKey: 'nav.tools', path: '/outils' },
];