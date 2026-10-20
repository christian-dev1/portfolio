import { Component, input } from '@angular/core';
import { LocalizePipe } from '../../../i18n/localize.pipe';
import { Availability } from '../../models/profile.model';

/** Pastille de disponibilité : point de couleur (pulsation discrète si disponible) + libellé. */
@Component({
  selector: 'app-availability-badge',
  imports: [LocalizePipe],
  templateUrl: './availability-badge.html',
  styleUrl: './availability-badge.scss',
})
export class AvailabilityBadge {
  readonly availability = input.required<Availability>();
}
