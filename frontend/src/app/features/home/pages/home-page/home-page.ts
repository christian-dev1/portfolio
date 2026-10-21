import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { startWith, switchMap } from 'rxjs';
import { LanguageService } from '../../../../core/i18n/language.service';
import { CvPdfService } from '../../../../shared/contact-config/data-access/cv-pdf.service';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { AvailabilityBadge } from '../../../../shared/profile/components/availability-badge/availability-badge';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { Project, projectInitials } from '../../../../shared/projects/models/project.model';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { CountUp } from '../../../../shared/ui/count-up/count-up';
import { Stagger } from '../../../../shared/ui/stagger/stagger';
import { BandOrbit } from '../../components/band-orbit/band-orbit';

type HomeTile =
  | { kind: 'project'; project: Project; lead: boolean }
  | { kind: 'tools' | 'availability' | 'founder' };

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    TranslocoPipe,
    LocalizePipe,
    AvailabilityBadge,
    BandOrbit,
    CountUp,
    Stagger,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly profile = toSignal(inject(ProfileService).getProfile());
  private readonly projects = toSignal(inject(ProjectService).getPublicProjects());
  protected readonly tools = toSignal(inject(ToolService).getPublicTools());
  private readonly language = inject(LanguageService);
  private readonly cvPdf = inject(CvPdfService);
  private readonly manifesto = toSignal(
    inject(TranslocoService).selectTranslate('home.editorial.manifesto'),
  );

  protected readonly featuredProjects = computed(() =>
    this.projects()?.filter((project) => project.featured),
  );
  protected readonly tiles = computed<HomeTile[]>(() => {
    const [first, ...others] = this.featuredProjects() ?? [];
    return [
      ...(first ? [{ kind: 'project' as const, project: first, lead: true }] : []),
      { kind: 'tools' },
      ...others.map((project) => ({ kind: 'project' as const, project, lead: false })),
      { kind: 'availability' },
      { kind: 'founder' },
    ];
  });
  protected readonly projectInitials = projectInitials;
  protected readonly manifestoWords = computed(() => this.manifesto()?.split(/\s+/) ?? []);
  protected readonly cvUrl = toSignal(
    toObservable(this.language.lang).pipe(
      switchMap((lang) => this.cvPdf.getAvailableUrl(lang).pipe(startWith(''))),
    ),
    { initialValue: '' },
  );
  protected readonly orbitText = computed(
    () =>
      (this.tools() ?? [])
        .map((tool) => tool.name[this.language.lang()].toUpperCase())
        .join(' · ') + ' · ',
  );
  protected readonly photoFailed = signal(false);
  protected readonly initials = computed(() =>
    (this.profile()?.fullName ?? '')
      .split(' ')
      .slice(-2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase(),
  );
}
