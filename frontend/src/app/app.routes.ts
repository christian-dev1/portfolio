import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
    {
    path: 'projets',
    loadChildren: () =>
      import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
    {
    path: 'outils',
    loadChildren: () =>
      import('./features/tools/tools.routes').then((m) => m.TOOLS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];