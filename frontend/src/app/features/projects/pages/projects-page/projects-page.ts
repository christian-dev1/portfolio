import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ProjectCard } from '../../../../shared/projects/components/project-card/project-card';

@Component({
  selector: 'app-projects-page',
  imports: [ProjectCard, TranslocoPipe],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectService = inject(ProjectService);

  protected readonly projects = toSignal(this.projectService.getPublicProjects());
}
