import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CareerTimeline } from '../../../../shared/career/components/career-timeline/career-timeline';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { SocialNetwork } from '../../../../shared/profile/models/profile.model';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { TOOL_CATEGORIES } from '../../../../shared/tools/models/tool.model';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { CvProjects } from '../../components/cv-projects/cv-projects';

@Component({
  selector: 'app-cv-page',
  imports: [RouterLink, TranslocoPipe, LocalizePipe, PageBanner, CareerTimeline, CvProjects],
  templateUrl: './cv-page.html',
  styleUrl: './cv-page.scss',
})
export class CvPage {
  protected readonly profile = toSignal(inject(ProfileService).getProfile());
  protected readonly projects = toSignal(inject(ProjectService).getPublicProjects());
  protected readonly career = toSignal(inject(CareerService).getCareer());
  private readonly tools = toSignal(inject(ToolService).getPublicTools());

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

  /** Lien WhatsApp à partir du numéro (chiffres seuls), ou vide si non renseigné. */
  protected readonly whatsappUrl = computed(() => {
    const digits = this.profile()?.whatsapp.replace(/\D/g, '') ?? '';
    return digits ? `https://wa.me/${digits}` : '';
  });

  protected telHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  private link(network: SocialNetwork): string {
    return (
      this.profile()
        ?.socialLinks.find((link) => link.network === network)
        ?.url.trim() ?? ''
    );
  }
}
