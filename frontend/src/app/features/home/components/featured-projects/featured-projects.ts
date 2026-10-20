import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectCard } from '../../../../shared/projects/components/project-card/project-card';
import { Project } from '../../../../shared/projects/models/project.model';

/** « Projets mis en avant » : titre et intro dans une colonne à gauche, cartes à droite (bureau). */
@Component({
  selector: 'app-featured-projects',
  imports: [RouterLink, TranslocoPipe, ProjectCard],
  templateUrl: './featured-projects.html',
  styleUrl: './featured-projects.scss',
})
export class FeaturedProjects {
  /** `undefined` pendant le chargement. */
  readonly projects = input<Project[]>();
}
