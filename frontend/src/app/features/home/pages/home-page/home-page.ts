import { LanguageService } from '../../../../core/i18n/language.service';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CvDownloadButton } from '../../../../shared/contact-config/components/cv-download-button/cv-download-button';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { AvailabilityBadge } from '../../../../shared/profile/components/availability-badge/availability-badge';
import { SocialLinks } from '../../../../shared/profile/components/social-links/social-links';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { SocialNetwork } from '../../../../shared/profile/models/profile.model';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { ContentUnavailable } from '../../../../shared/ui/content-unavailable/content-unavailable';
import { loadable } from '../../../../shared/ui/content-unavailable/loadable';
import { BandOrbit } from '../../components/band-orbit/band-orbit';
import { FeaturedProjects } from '../../components/featured-projects/featured-projects';
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
    KeyFigures,
    BandOrbit,
    FeaturedProjects,
    CvDownloadButton,
    ContentUnavailable,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly profileService = inject(ProfileService);
  private readonly projectService = inject(ProjectService);
  private readonly toolService = inject(ToolService);

  protected readonly heroNetworks = HERO_NETWORKS;
  private readonly profileLoad = loadable(this.profileService.getProfile());
  private readonly projectsLoad = loadable(this.projectService.getPublicProjects());
  protected readonly profile = this.profileLoad.value;
  protected readonly profileFailed = this.profileLoad.failed;
  private readonly projects = this.projectsLoad.value;
  protected readonly projectsFailed = this.projectsLoad.failed;
  protected readonly tools = loadable(this.toolService.getPublicTools()).value;

  protected readonly featuredProjects = computed(() =>
    this.projects()?.filter((project) => project.featured),
  );
  protected readonly projectCount = computed(() => this.projects()?.length);
  protected readonly toolCount = computed(() => this.tools()?.length);

  private readonly language = inject(LanguageService);
  protected readonly orbitText = computed(
    () =>
      (this.tools() ?? [])
        .map((tool) => tool.name[this.language.lang()].toUpperCase())
        .join(' · ') + ' · ',
  );

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
