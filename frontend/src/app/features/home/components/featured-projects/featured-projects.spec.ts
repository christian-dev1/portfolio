import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { FeaturedProjects } from './featured-projects';

const PROJECT: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
  highlights: [],
  coverTagline: { fr: 'Accroche', en: 'Tagline' },
  context: 'b-her',
  roles: ['Backend'],
  technologies: [],
  status: 'in-progress',
  visible: true,
  featured: true,
};

describe('FeaturedProjects', () => {
  let fixture: ComponentFixture<FeaturedProjects>;
  let compiled: HTMLElement;

  async function render(projects?: Project[]): Promise<void> {
    fixture = TestBed.createComponent(FeaturedProjects);
    if (projects) {
      fixture.componentRef.setInput('projects', projects);
    }
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProjects, provideTranslocoForTests()],
      providers: [provideRouter([])],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
  });

  it('should introduce the section with a title, a lead and a link to all projects', async () => {
    await render([PROJECT]);

    expect(compiled.querySelector('h2')!.textContent).toContain('Projets mis en avant');
    expect(compiled.querySelector('.featured__lead')!.textContent!.trim()).not.toBe('');
    expect(compiled.querySelector('.featured__see-all')!.getAttribute('href')).toBe('/projets');
  });

  it('should display one card per project with a level 3 heading', async () => {
    await render([PROJECT]);

    expect(compiled.querySelector('app-project-card h3')!.textContent).toContain('WIMO');
  });

  it('should display loading and empty states', async () => {
    await render();
    expect(compiled.textContent).toContain('Chargement des projets');

    fixture.componentRef.setInput('projects', []);
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Aucun projet mis en avant');
  });
});
