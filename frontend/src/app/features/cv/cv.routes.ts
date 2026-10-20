import { Routes } from '@angular/router';

export const CV_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cv-page/cv-page').then((m) => m.CvPage),
    title: 'titles.cv',
  },
];
