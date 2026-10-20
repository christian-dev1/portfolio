import { Component, computed, input } from '@angular/core';
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
