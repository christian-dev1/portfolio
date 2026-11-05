import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { BrandIcon } from '../../../../shared/ui/brand-icon/brand-icon';
import {
  BRAND_ICONS,
  BrandIcon as BrandIconData,
  isBrandIconSlug,
} from '../../../../shared/ui/brand-icons';
import { Stagger } from '../../../../shared/ui/stagger/stagger';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { ContentUnavailable } from '../../../../shared/ui/content-unavailable/content-unavailable';
import { loadable } from '../../../../shared/ui/content-unavailable/loadable';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { Tool, ToolCategory, TOOL_CATEGORIES } from '../../../../shared/tools/models/tool.model';

interface ToolTile {
  tool: Tool;
  /** Logo de marque, ou `undefined` → on affiche le monogramme. */
  icon?: BrandIconData;
}

interface ToolGroup {
  category: ToolCategory;
  labelKey: string;
  /** Nombre d'outils sur 2 chiffres, ex. « 03 ». */
  count: string;
  tiles: ToolTile[];
}

@Component({
  selector: 'app-tools-page',
  imports: [TranslocoPipe, LocalizePipe, BrandIcon, PageBanner, Stagger, ContentUnavailable],
  templateUrl: './tools-page.html',
  styleUrl: './tools-page.scss',
})
export class ToolsPage {
  private readonly toolService = inject(ToolService);
  private readonly toolsLoad = loadable(this.toolService.getPublicTools());
  private readonly tools = this.toolsLoad.value;
  protected readonly failed = this.toolsLoad.failed;

  protected readonly toolCount = computed(() => this.tools()?.length);

  protected readonly groups = computed<ToolGroup[] | undefined>(() => {
    const tools = this.tools();

    if (!tools) {
      return undefined;
    }

    return TOOL_CATEGORIES.map((category) => {
      const tiles = tools
        .filter((tool) => tool.category === category)
        .map((tool) => ({
          tool,
          icon: tool.icon && isBrandIconSlug(tool.icon) ? BRAND_ICONS[tool.icon] : undefined,
        }));
      return {
        category,
        labelKey: `tools.category.${category}`,
        count: String(tiles.length).padStart(2, '0'),
        tiles,
      };
    }).filter((group) => group.tiles.length > 0);
  });
}
