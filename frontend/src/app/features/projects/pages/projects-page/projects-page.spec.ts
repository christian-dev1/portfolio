import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProjectsPage } from './projects-page';
import { ProjectService } from '../../data-access/project.service';
import { Project } from '../../models/project.model';

const projects: Project[] = [
  {
    id: 'wimo',
    name: 'WIMO',
    summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
    context: 'b-her',
    roles: ['Backend'],
    technologies: ['Spring Boot'],
    status: 'in-progress',
    visible: true,
  },
  {
    id: 'sekouh',
    name: 'Sekouh',
    summary: { fr: 'Gestion scolaire.', en: 'School management.' },
    context: 'collaboration',
    roles: ['QA'],
    technologies: [],
    status: 'in-progress',
    visible: true,
  },
];

async function setup(
  projects$: Observable<Project[]>,
  lang: 'fr' | 'en' = 'fr',
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [ProjectsPage, provideTranslocoForTests()],
    providers: [{ provide: ProjectService, useValue: { getPublicProjects: () => projects$ } }],
  });

  TestBed.inject(LanguageService).lang.set(lang);
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

  it('should display the title and messages in English when the language is English', async () => {
    const compiled = await setup(of([]), 'en');

    expect(compiled.querySelector('h1')!.textContent).toContain('Projects');
    expect(compiled.textContent).toContain('No projects to display yet.');
  });
});
