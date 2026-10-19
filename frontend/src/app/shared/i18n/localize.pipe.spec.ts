import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../core/i18n/language.service';
import { provideTranslocoForTests } from '../../../testing/transloco-testing';
import { LocalizePipe } from './localize.pipe';

describe('LocalizePipe', () => {
  const greeting = { fr: 'Bonjour', en: 'Hello' };
  let pipe: LocalizePipe;
  let language: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [provideTranslocoForTests()] });
    language = TestBed.inject(LanguageService);
    pipe = TestBed.runInInjectionContext(() => new LocalizePipe());
  });

  it('should return the French text when the language is French', () => {
    language.lang.set('fr');
    expect(pipe.transform(greeting)).toBe('Bonjour');
  });

  it('should return the English text when the language is English', () => {
    language.lang.set('en');
    expect(pipe.transform(greeting)).toBe('Hello');
  });
});
