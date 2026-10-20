import { Routes } from '@angular/router';

export const TOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tools-page/tools-page').then((m) => m.ToolsPage),
    title: 'titles.tools',
  },
];
