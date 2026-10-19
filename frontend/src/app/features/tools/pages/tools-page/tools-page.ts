import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { ToolService } from '../../data-access/tool.service';
import { Tool, ToolCategory, TOOL_CATEGORIES } from '../../models/tool.model';

interface ToolGroup {
  category: ToolCategory;
  labelKey: string;
  tools: Tool[];
}

@Component({
  selector: 'app-tools-page',
  imports: [TranslocoPipe, LocalizePipe],
  templateUrl: './tools-page.html',
  styleUrl: './tools-page.scss',
})
export class ToolsPage {
  private readonly toolService = inject(ToolService);
  private readonly tools = toSignal(this.toolService.getPublicTools());

  protected readonly groups = computed<ToolGroup[] | undefined>(() => {
    const tools = this.tools();

    if (!tools) {
      return undefined;
    }

    return TOOL_CATEGORIES.map((category) => ({
      category,
      labelKey: `tools.category.${category}`,
      tools: tools.filter((tool) => tool.category === category),
    })).filter((group) => group.tools.length > 0);
  });
}
