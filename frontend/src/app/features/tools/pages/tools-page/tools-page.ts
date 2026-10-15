import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToolService } from '../../data-access/tool.service';
import {
  Tool,
  ToolCategory,
  TOOL_CATEGORY_LABELS,
  TOOL_CATEGORY_ORDER,
} from '../../models/tool.model';

interface ToolGroup {
  category: ToolCategory;
  label: string;
  tools: Tool[];
}

@Component({
  selector: 'app-tools-page',
  imports: [],
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

    return TOOL_CATEGORY_ORDER.map((category) => ({
      category,
      label: TOOL_CATEGORY_LABELS[category],
      tools: tools.filter((tool) => tool.category === category),
    })).filter((group) => group.tools.length > 0);
  });
}