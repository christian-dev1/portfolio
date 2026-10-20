import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

/** Chiffres clés de l'accueil, calculés depuis les données (jamais écrits en dur). */
@Component({
  selector: 'app-key-figures',
  imports: [TranslocoPipe],
  templateUrl: './key-figures.html',
  styleUrl: './key-figures.scss',
})
export class KeyFigures {
  /** `undefined` tant que les données ne sont pas chargées. */
  readonly projectCount = input<number>();
  readonly toolCount = input<number>();
  readonly companyName = input.required<string>();

  protected pad(count: number): string {
    return String(count).padStart(2, '0');
  }
}
