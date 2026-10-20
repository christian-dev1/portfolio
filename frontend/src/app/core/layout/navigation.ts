export interface NavItem {
  labelKey: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.projects', path: '/projets' },
  { labelKey: 'nav.tools', path: '/outils' },
  { labelKey: 'nav.about', path: '/a-propos' },
  { labelKey: 'nav.cv', path: '/cv' },
  { labelKey: 'nav.contact', path: '/contact' },
];

/** Liens discrets répétés dans le footer. */
export const FOOTER_LINKS: NavItem[] = NAV_ITEMS.filter((item) =>
  ['/a-propos', '/cv', '/contact'].includes(item.path),
);
