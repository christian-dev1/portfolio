import { toSignal } from '@angular/core/rxjs-interop';
import { ToolService } from '../../tools/data-access/tool.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CountUp } from '../count-up/count-up';

/** Bandeau des pages intérieures : zone bleue à points, h1, bande rouge et grand compteur. */
@Component({
  selector: 'app-page-banner',
  imports: [TranslocoPipe, CountUp],
  templateUrl: './page-banner.html',
  styleUrl: './page-banner.scss',
})
export class PageBanner {
  private readonly tools = toSignal(inject(ToolService).getPublicTools());
  private readonly language = inject(LanguageService);
  protected readonly technologyText = computed(
    () =>
      (this.tools() ?? [])
        .map((tool) => tool.name[this.language.lang()].toUpperCase())
        .join(' · ') + ' · ',
  );
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly introKey = input.required<string>();
  /** Compteur facultatif : affiché seulement avec un libellé et un nombre. */
  readonly countLabelKey = input<string>();
  /** Nombre réel calculé depuis les données ; `undefined` pendant le chargement. */
  readonly count = input<number>();

  /** Compteur affiché seulement avec un libellé et un nombre (objet : 0 reste « vrai » dans @if). */
  protected readonly shownCount = computed(() => {
    const value = this.count();
    return value === undefined || !this.countLabelKey() ? undefined : { value };
  });
}
