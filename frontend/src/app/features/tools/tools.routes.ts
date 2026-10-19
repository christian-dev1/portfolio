import { Routes } from '@angular/router';
import { ToolsPage } from './pages/tools-page/tools-page';

export const TOOLS_ROUTES: Routes = [
  {
    path: '',
    component: ToolsPage,
    title: 'titles.tools',
  },
];