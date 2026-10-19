import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../i18n/localize.pipe';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [TranslocoPipe, LocalizePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  /** Niveau du titre de la carte : 2 sous le h1 d'une page, 3 sous une section en h2. */
  readonly headingLevel = input<2 | 3>(2);

  protected readonly initials = computed(() =>
    this.project()
      .name.split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase(),
  );

  protected readonly statusKey = computed(() => `projects.status.${this.project().status}`);

  protected readonly contextKey = computed(() => `projects.context.${this.project().context}`);
}
