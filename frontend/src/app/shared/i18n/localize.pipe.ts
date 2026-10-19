import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { LocalizedText } from './localized-text';

@Pipe({ name: 'localize', pure: false })
export class LocalizePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(text: LocalizedText): string {
    return text[this.language.lang()];
  }
}