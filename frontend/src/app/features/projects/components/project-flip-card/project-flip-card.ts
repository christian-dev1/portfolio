import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectDetails } from '../../../../shared/projects/components/project-details/project-details';
import { Project, projectInitials } from '../../../../shared/projects/models/project.model';
import { CardToggle } from '../../../../shared/ui/card-toggle/card-toggle';

/**
 * Carte de projet qui se retourne : le recto montre l'onglet et le logo, le verso le détail.
 * Elle se retourne au survol, au focus clavier et à l'appui (bascule, `aria-pressed`).
 * Les deux faces restent lues par les lecteurs d'écran ; le lien du verso ne prend le focus
 * que carte retournée. Avec les animations réduites, le verso s'affiche sous le recto.
 */
@Component({
  selector: 'app-project-flip-card',
  imports: [NgTemplateOutlet, TranslocoPipe, CardToggle, ProjectDetails],
  templateUrl: './project-flip-card.html',
  styleUrl: './project-flip-card.scss',
})
export class ProjectFlipCard {
  readonly project = input.required<Project>();

  protected readonly initials = computed(() => projectInitials(this.project().name));

  protected readonly tabKey = computed(() => `projects.tab.${this.project().context}`);
}
