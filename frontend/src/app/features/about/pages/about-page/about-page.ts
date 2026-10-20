import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { CareerTimeline } from '../../../../shared/career/components/career-timeline/career-timeline';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { AvailabilityBadge } from '../../../../shared/profile/components/availability-badge/availability-badge';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';

@Component({
  selector: 'app-about-page',
  imports: [TranslocoPipe, LocalizePipe, PageBanner, CareerTimeline, AvailabilityBadge],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly profile = toSignal(inject(ProfileService).getProfile());
  protected readonly career = toSignal(inject(CareerService).getCareer());
}
