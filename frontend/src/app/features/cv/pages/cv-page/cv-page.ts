import { Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CareerTimeline } from '../../../../shared/career/components/career-timeline/career-timeline';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { CvDownloadButton } from '../../../../shared/contact-config/components/cv-download-button/cv-download-button';
import { WhatsappButton } from '../../../../shared/contact-config/components/whatsapp-button/whatsapp-button';
import { ContactConfigService } from '../../../../shared/contact-config/data-access/contact-config.service';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { SocialNetwork } from '../../../../shared/profile/models/profile.model';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { TOOL_CATEGORIES } from '../../../../shared/tools/models/tool.model';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { CvProjects } from '../../components/cv-projects/cv-projects';
import { PAGE_LOCATION, isCompleteCv } from '../../data-access/complete-cv';

/** Adresse imprimée en texte court : « https://www.linkedin.com/in/x/ » → « linkedin.com/in/x ». */
export function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
}

@Component({
  selector: 'app-cv-page',
  imports: [
    RouterLink,
    TranslocoPipe,
    LocalizePipe,
    PageBanner,
    CareerTimeline,
    CvProjects,
    WhatsappButton,
    CvDownloadButton,
  ],
  templateUrl: './cv-page.html',
  styleUrl: './cv-page.scss',
  host: {
    '(window:beforeprint)': 'useDocumentTitle()',
    '(window:afterprint)': 'restoreTitle()',
  },
})
export class CvPage {
  protected readonly profile = toSignal(inject(ProfileService).getProfile());
  protected readonly projects = toSignal(inject(ProjectService).getPublicProjects());
  protected readonly career = toSignal(inject(CareerService).getCareer());
  private readonly tools = toSignal(inject(ToolService).getPublicTools());
  /** Coordonnées personnelles hors Git ; vides si le fichier de configuration est absent. */
  protected readonly contactConfig = toSignal(inject(ContactConfigService).getContactConfig());
  /** Numéros affichés seulement en local avec `?complet=1` : le CV public n'en contient jamais. */
  protected readonly complete = isCompleteCv(inject(PAGE_LOCATION));

  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private titleBeforePrint: string | null = null;

  /** Compétences compactes : une ligne par catégorie, dans l'ordre de la boîte à outils. */
  protected readonly skills = computed(() => {
    const tools = this.tools();
    return tools
      ? TOOL_CATEGORIES.map((category) => ({
          labelKey: `tools.category.${category}`,
          tools: tools.filter((tool) => tool.category === category).map((tool) => tool.name),
        })).filter((group) => group.tools.length > 0)
      : undefined;
  });

  protected readonly email = computed(() => this.link('email'));
  protected readonly linkedin = computed(() => this.link('linkedin'));
  protected readonly github = computed(() => this.link('github'));
  protected readonly shortUrl = shortUrl;

  /** Only the city is displayed, on screen and on paper. */
  protected city(location: string): string {
    return location.split(',')[0].trim();
  }

  protected telHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  /** Titre du PDF enregistré depuis la boîte d'impression (métadonnées propres). */
  protected useDocumentTitle(): void {
    this.titleBeforePrint ??= this.title.getTitle();
    this.title.setTitle(this.transloco.translate('cv.printTitle'));
  }

  protected restoreTitle(): void {
    if (this.titleBeforePrint !== null) {
      this.title.setTitle(this.titleBeforePrint);
      this.titleBeforePrint = null;
    }
  }

  private link(network: SocialNetwork): string {
    return (
      this.profile()
        ?.socialLinks.find((link) => link.network === network)
        ?.url.trim() ?? ''
    );
  }
}
