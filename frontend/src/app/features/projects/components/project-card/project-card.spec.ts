import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProjectCard } from './project-card';
import { Project } from '../../models/project.model';

const baseProject: Project = {
  id: 'vesty-shop',
  name: 'Vesty Shop',
  summary: { fr: 'Boutique de vêtements en ligne.', en: 'Online clothing store.' },
  context: 'b-her',
  roles: ['Backend', 'QA'],
  technologies: ['Spring Boot', 'Angular'],
  status: 'in-progress',
  visible: true,
};

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>;
  let compiled: HTMLElement;
  let language: LanguageService;

  async function render(project: Project): Promise<void> {
    fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', project);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard, provideTranslocoForTests()],
    }).compileComponents();

    language = TestBed.inject(LanguageService);
    language.lang.set('fr');
  });

  it('should display the project name and summary', async () => {
    await render(baseProject);

    const name = compiled.querySelector('h2');
    expect(name).not.toBeNull();
    expect(name!.textContent).toContain('Vesty Shop');
    expect(compiled.textContent).toContain('Boutique de vêtements en ligne.');
  });

  it('should display the initials when there is no image', async () => {
    await render(baseProject);

    const thumbnail = compiled.querySelector('.project-card__thumbnail');
    expect(thumbnail!.textContent!.trim()).toBe('VS');
  });

  it('should display the status label in French', async () => {
    await render(baseProject);

    expect(compiled.textContent).toContain('En développement');
  });

  it('should display the pilot status label', async () => {
    await render({ ...baseProject, status: 'pilot' });

    expect(compiled.textContent).toContain('En phase pilote');
  });

  it('should display the context label', async () => {
    await render(baseProject);

    expect(compiled.textContent).toContain('Projet B-HER EMPIRE');
  });

  it('should display the summary, status and context in English when the language is English', async () => {
    language.lang.set('en');

    await render(baseProject);

    expect(compiled.textContent).toContain('Online clothing store.');
    expect(compiled.textContent).toContain('In development');
    expect(compiled.textContent).toContain('B-HER EMPIRE project');
    expect(compiled.textContent).toContain('My role');
  });

  it('should hide the technologies section when the list is empty', async () => {
    await render({ ...baseProject, technologies: [] });

    expect(compiled.textContent).not.toContain('Technologies');
  });

  it('should open the repository link safely in a new tab', async () => {
    await render({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });

    const link = compiled.querySelector('a.project-card__link');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('https://gitlab.com/exemple');
    expect(link!.getAttribute('target')).toBe('_blank');
    expect(link!.getAttribute('rel')).toContain('noopener');
    expect(link!.textContent).toContain('Voir le code');
  });

  it('should mention that the code is private for a team project without link', async () => {
    await render({ ...baseProject, context: 'collaboration' });

    expect(compiled.textContent).toContain('Code non public (projet en équipe)');
  });
});
