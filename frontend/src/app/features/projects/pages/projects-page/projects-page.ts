import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ProjectFlipCard } from '../../components/project-flip-card/project-flip-card';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';

@Component({
  selector: 'app-projects-page',
  imports: [PageBanner, ProjectFlipCard, TranslocoPipe],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectService = inject(ProjectService);

  protected readonly projects = toSignal(this.projectService.getPublicProjects());
}
