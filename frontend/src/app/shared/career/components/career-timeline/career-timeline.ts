import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../i18n/localize.pipe';
import { Stagger } from '../../../ui/stagger/stagger';
import { CareerEntry } from '../../models/career.model';

/** Frise verticale du parcours : ligne rouge, un point et les années par entrée. */
@Component({
  selector: 'app-career-timeline',
  imports: [TranslocoPipe, LocalizePipe, Stagger],
  templateUrl: './career-timeline.html',
  styleUrl: './career-timeline.scss',
})
export class CareerTimeline {
  /** Entrées déjà filtrées et triées (voir `CareerService.getCareer`). */
  readonly entries = input.required<CareerEntry[]>();

  protected years(entry: CareerEntry): string {
    return entry.startYear && entry.startYear !== entry.endYear
      ? `${entry.startYear} – ${entry.endYear}`
      : String(entry.endYear);
  }
}
