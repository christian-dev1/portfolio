import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { LANG_STORAGE_KEY, LanguageService } from './language.service';
import { provideTranslocoForTests } from '../../../testing/transloco-testing';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [provideTranslocoForTests()],
    });
  });

  it('should use the saved language when there is one', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en');

    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('en');
  });

  it('should switch between French and English', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'fr');
    const service = TestBed.inject(LanguageService);

    service.toggle();

    expect(service.lang()).toBe('en');
  });

  it('should remember the language chosen by the visitor', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'fr');
    const service = TestBed.inject(LanguageService);

    service.toggle();

    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
  });

  it('should apply the language to Transloco and to the html element', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en');

    TestBed.inject(LanguageService);
    TestBed.tick();

    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});