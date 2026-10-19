import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type Lang = 'fr' | 'en';

export const LANG_STORAGE_KEY = 'luchrist-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    effect(() => {
      const lang = this.lang();
      this.transloco.setActiveLang(lang);
      this.document.documentElement.lang = lang;
    });
  }

  toggle(): void {
    const next: Lang = this.lang() === 'fr' ? 'en' : 'fr';
    this.lang.set(next);
    this.save(next);
  }

  private initialLang(): Lang {
    const saved = this.readSaved();
    if (saved) {
      return saved;
    }

    const browserLang = this.document.defaultView?.navigator?.language ?? 'fr';
    return browserLang.startsWith('en') ? 'en' : 'fr';
  }

  private readSaved(): Lang | null {
    try {
      const value = localStorage.getItem(LANG_STORAGE_KEY);
      return value === 'fr' || value === 'en' ? value : null;
    } catch {
      return null;
    }
  }

  private save(lang: Lang): void {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Stockage indisponible : la langue change quand même, sans mémorisation.
    }
  }
}