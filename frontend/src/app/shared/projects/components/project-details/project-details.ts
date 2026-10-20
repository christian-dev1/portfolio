import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../i18n/localize.pipe';
import { Project } from '../../models/project.model';

/** Texte d'un projet : nom, statut, résumé, rôle, stack, points forts et lien vers le code. */
@Component({
  selector: 'app-project-details',
  imports: [TranslocoPipe, LocalizePipe],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  readonly project = input.required<Project>();

  /** Niveau du titre : 2 sous le h1 d'une page, 3 sous une section en h2. */
  readonly headingLevel = input<2 | 3>(2);

  /** `false` retire le lien de l'ordre de tabulation (face cachée d'une carte retournable). */
  readonly linksFocusable = input(true);

  protected readonly statusKey = computed(() => `projects.status.${this.project().status}`);
}
