import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProjectsPage } from './projects-page';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { Project } from '../../../../shared/projects/models/project.model';

const projects: Project[] = [
  {
    id: 'wimo',
    name: 'WIMO',
    summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
    highlights: [],
    coverTagline: { fr: 'Accroche', en: 'Tagline' },
    context: 'b-her',
    roles: ['Backend'],
    technologies: ['Spring Boot'],
    status: 'in-progress',
    visible: true,
    featured: false,
  },
  {
    id: 'sekouh',
    name: 'Sekouh',
    summary: { fr: 'Gestion scolaire.', en: 'School management.' },
    highlights: [],
    coverTagline: { fr: 'Accroche', en: 'Tagline' },
    context: 'collaboration',
    roles: ['QA'],
    technologies: [],
    status: 'in-progress',
    visible: true,
    featured: false,
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

    expect(compiled.querySelectorAll('app-project-flip-card').length).toBe(2);
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

  it('should have a single h1, in the page banner', async () => {
    const compiled = await setup(of(projects));

    const titles = compiled.querySelectorAll('h1');
    expect(titles.length).toBe(1);
    expect(titles[0].closest('app-page-banner')).not.toBeNull();
  });

  it('should count the displayed projects in the banner', async () => {
    const compiled = await setup(of(projects));

    expect(compiled.querySelector('.page-banner__count')!.textContent).toBe('02');
  });
});
