export interface NavItem{
    label: string;
    path: string;
}
export const NAV_ITEMS: NavItem[] = [
    { label: 'Acceuil', path: '/'},
    { label: 'Projets', path: '/projets' },
    { label: 'Outils', path: '/outils' },
]