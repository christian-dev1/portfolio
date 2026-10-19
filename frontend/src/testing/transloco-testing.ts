import { TranslocoTestingModule } from '@jsverse/transloco';
import fr from '../../public/i18n/fr.json';
import en from '../../public/i18n/en.json';

export function provideTranslocoForTests() {
  return TranslocoTestingModule.forRoot({
    langs: { fr, en },
    translocoConfig: { availableLangs: ['fr', 'en'], defaultLang: 'fr' },
    preloadLangs: true,
  });
}
