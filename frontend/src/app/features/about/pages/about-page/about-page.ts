import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CareerTimeline } from '../../../../shared/career/components/career-timeline/career-timeline';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { AvailabilityBadge } from '../../../../shared/profile/components/availability-badge/availability-badge';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { Stagger } from '../../../../shared/ui/stagger/stagger';
import { ContentUnavailable } from '../../../../shared/ui/content-unavailable/content-unavailable';
import { loadable } from '../../../../shared/ui/content-unavailable/loadable';

@Component({
  selector: 'app-about-page',
  imports: [
    TranslocoPipe,
    LocalizePipe,
    PageBanner,
    CareerTimeline,
    AvailabilityBadge,
    Stagger,
    ContentUnavailable,
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  private readonly profileLoad = loadable(inject(ProfileService).getProfile());
  private readonly careerLoad = loadable(inject(CareerService).getCareer());
  protected readonly profile = this.profileLoad.value;
  protected readonly profileFailed = this.profileLoad.failed;
  protected readonly career = this.careerLoad.value;
  protected readonly careerFailed = this.careerLoad.failed;
}
