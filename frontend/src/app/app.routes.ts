import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'projets',
    loadChildren: () =>
      import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
  {
    path: 'outils',
    loadChildren: () => import('./features/tools/tools.routes').then((m) => m.TOOLS_ROUTES),
  },
  {
    path: 'a-propos',
    loadChildren: () => import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: 'cv',
    loadChildren: () => import('./features/cv/cv.routes').then((m) => m.CV_ROUTES),
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
