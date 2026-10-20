import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProfileService } from '../../../shared/profile/data-access/profile.service';
import { SocialLinks } from '../../../shared/profile/components/social-links/social-links';
import { FOOTER_LINKS } from '../navigation';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslocoPipe, SocialLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly profileService = inject(ProfileService);

  protected readonly links = FOOTER_LINKS;
  protected readonly year = new Date().getFullYear();
  protected readonly profile = toSignal(this.profileService.getProfile());
}
