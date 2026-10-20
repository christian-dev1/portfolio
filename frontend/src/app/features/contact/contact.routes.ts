import { Routes } from '@angular/router';
import { ContactPage } from './pages/contact-page/contact-page';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    component: ContactPage,
    title: 'titles.contact',
  },
];
