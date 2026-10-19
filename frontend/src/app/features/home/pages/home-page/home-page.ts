import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { SocialLinks } from '../../../../shared/profile/components/social-links/social-links';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ProjectCard } from '../../../../shared/projects/components/project-card/project-card';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TranslocoPipe, LocalizePipe, SocialLinks, ProjectCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly profileService = inject(ProfileService);
  private readonly projectService = inject(ProjectService);

  protected readonly profile = toSignal(this.profileService.getProfile());
  protected readonly featuredProjects = toSignal(this.projectService.getFeaturedProjects());

  /** Passe à true si la photo ne charge pas : on affiche alors les initiales. */
  protected readonly photoFailed = signal(false);

  /** Initiales du prénom usuel : « … Christian Luther » → « CL ». */
  protected readonly initials = computed(() =>
    (this.profile()?.fullName ?? '')
      .split(' ')
      .slice(-2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase(),
  );
}
