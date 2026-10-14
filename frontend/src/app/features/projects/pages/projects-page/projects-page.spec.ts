import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { ProjectsPage } from './projects-page';
import { ProjectService } from '../../data-access/project.service';
import { Project } from '../../models/project.model';

const projects: Project[] = [
  {
    id: 'wimo',
    name: 'WIMO',
    summary: 'Transfert d’argent.',
    context: 'b-her',
    roles: ['Backend'],
    technologies: ['Spring Boot'],
    status: 'in-progress',
    visible: true,
  },
  {
    id: 'sekouh',
    name: 'Sekouh',
    summary: 'Gestion scolaire.',
    context: 'collaboration',
    roles: ['QA'],
    technologies: [],
    status: 'in-progress',
    visible: true,
  },
];

async function setup(projects$: Observable<Project[]>): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [ProjectsPage],
    providers: [
      { provide: ProjectService, useValue: { getPublicProjects: () => projects$ } },
    ],
  });

  const fixture = TestBed.createComponent(ProjectsPage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ProjectsPage', () => {
  it('should display one card per project', async () => {
    const compiled = await setup(of(projects));

    expect(compiled.querySelectorAll('app-project-card').length).toBe(2);
  });

  it('should display a message when there is no project', async () => {
    const compiled = await setup(of([]));

    expect(compiled.textContent).toContain('Aucun projet à afficher');
  });

  it('should display a loading message while projects are loading', async () => {
    const compiled = await setup(NEVER);

    expect(compiled.textContent).toContain('Chargement des projets');
  });
});