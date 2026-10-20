import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/about-page/about-page').then((m) => m.AboutPage),
    title: 'titles.about',
  },
];
