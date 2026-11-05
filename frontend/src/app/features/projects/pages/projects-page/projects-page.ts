import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { ProjectFlipCard } from '../../components/project-flip-card/project-flip-card';
import { PageBanner } from '../../../../shared/ui/page-banner/page-banner';
import { ContentUnavailable } from '../../../../shared/ui/content-unavailable/content-unavailable';
import { loadable } from '../../../../shared/ui/content-unavailable/loadable';

@Component({
  selector: 'app-projects-page',
  imports: [PageBanner, ProjectFlipCard, TranslocoPipe, ContentUnavailable],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectService = inject(ProjectService);

  private readonly projectsLoad = loadable(this.projectService.getPublicProjects());
  protected readonly projects = this.projectsLoad.value;
  protected readonly failed = this.projectsLoad.failed;
}
