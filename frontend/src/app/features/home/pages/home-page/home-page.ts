import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { AvailabilityBadge } from '../../../../shared/profile/components/availability-badge/availability-badge';
import { SocialLinks } from '../../../../shared/profile/components/social-links/social-links';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { SocialNetwork } from '../../../../shared/profile/models/profile.model';
import { ProjectCard } from '../../../../shared/projects/components/project-card/project-card';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { KeyFigures } from '../../components/key-figures/key-figures';

/** Réseaux affichés dans la zone bleue ; tous les autres restent dans le footer et sur /contact. */
const HERO_NETWORKS: readonly SocialNetwork[] = ['linkedin', 'github', 'gitlab', 'email'];

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    TranslocoPipe,
    LocalizePipe,
    AvailabilityBadge,
    SocialLinks,
    ProjectCard,
    KeyFigures,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly profileService = inject(ProfileService);
  private readonly projectService = inject(ProjectService);
  private readonly toolService = inject(ToolService);

  protected readonly heroNetworks = HERO_NETWORKS;
  protected readonly profile = toSignal(this.profileService.getProfile());
  private readonly projects = toSignal(this.projectService.getPublicProjects());
  private readonly tools = toSignal(this.toolService.getPublicTools());

  protected readonly featuredProjects = computed(() =>
    this.projects()?.filter((project) => project.featured),
  );
  protected readonly projectCount = computed(() => this.projects()?.length);
  protected readonly toolCount = computed(() => this.tools()?.length);

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
