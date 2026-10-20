import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { Tool } from '../../../../shared/tools/models/tool.model';
import { BrandIcon } from '../../../../shared/ui/brand-icon/brand-icon';
import { BRAND_ICONS, isBrandIconSlug } from '../../../../shared/ui/brand-icons';

/**
 * Ruban rouge où défilent en boucle les technologies visibles (logos blancs + noms).
 * La piste animée est décorative ; une liste en texte la double pour les lecteurs d'écran.
 */
@Component({
  selector: 'app-tech-marquee',
  imports: [TranslocoPipe, LocalizePipe, BrandIcon],
  templateUrl: './tech-marquee.html',
  styleUrl: './tech-marquee.scss',
})
export class TechMarquee {
  readonly tools = input.required<Tool[]>();

  protected readonly items = computed(() =>
    this.tools().map((tool) => ({
      tool,
      icon: tool.icon && isBrandIconSlug(tool.icon) ? BRAND_ICONS[tool.icon] : undefined,
    })),
  );

  /** Deux copies identiques : la piste recule de 50 % puis repart, sans saut visible. */
  protected readonly copies = [0, 1];
}
