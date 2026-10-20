import { Routes } from '@angular/router';
import { CvPage } from './pages/cv-page/cv-page';

export const CV_ROUTES: Routes = [
  {
    path: '',
    component: CvPage,
    title: 'titles.cv',
  },
];
