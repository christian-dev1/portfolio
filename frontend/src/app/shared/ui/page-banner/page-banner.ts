import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

/** Bandeau des pages intérieures : zone bleue à points, h1, bande rouge et grand compteur. */
@Component({
  selector: 'app-page-banner',
  imports: [TranslocoPipe],
  templateUrl: './page-banner.html',
  styleUrl: './page-banner.scss',
})
export class PageBanner {
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly introKey = input.required<string>();
  readonly countLabelKey = input.required<string>();
  /** Nombre réel calculé depuis les données ; `undefined` pendant le chargement. */
  readonly count = input<number>();

  protected readonly paddedCount = computed(() => {
    const count = this.count();
    return count === undefined ? undefined : String(count).padStart(2, '0');
  });
}
