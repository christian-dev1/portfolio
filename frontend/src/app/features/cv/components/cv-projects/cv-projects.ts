import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../../shared/i18n/localize.pipe';
import { Project } from '../../../../shared/projects/models/project.model';

/** Projets en version CV : nom, rôle, stack et points forts, sans couverture. */
@Component({
  selector: 'app-cv-projects',
  imports: [TranslocoPipe, LocalizePipe],
  templateUrl: './cv-projects.html',
  styleUrl: './cv-projects.scss',
})
export class CvProjects {
  readonly projects = input.required<Project[]>();
}
