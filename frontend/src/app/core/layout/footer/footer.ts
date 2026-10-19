import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../../shared/profile/data-access/profile.service';
import { SocialLinks } from '../../../shared/profile/components/social-links/social-links';

@Component({
  selector: 'app-footer',
  imports: [SocialLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly profileService = inject(ProfileService);

  protected readonly year = new Date().getFullYear();
  protected readonly profile = toSignal(this.profileService.getProfile());
}
