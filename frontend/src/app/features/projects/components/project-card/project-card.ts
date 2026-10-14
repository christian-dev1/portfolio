import { Component, computed, input } from '@angular/core';
import { Project, ProjectContext, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly initials = computed(() =>
    this.project()
      .name.split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase(),
  );

  protected readonly statusLabels: Record<ProjectStatus, string> = {
    'in-progress': 'En développement',
    completed: 'Terminé',
    concept: 'En conception',
  };

  protected readonly contextLabels: Record<ProjectContext, string> = {
    'b-her': 'Projet B-HER EMPIRE',
    collaboration: 'Projet en équipe',
  };
}