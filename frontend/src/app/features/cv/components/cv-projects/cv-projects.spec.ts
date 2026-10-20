import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { CvProjects } from './cv-projects';

const PROJECT: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
  highlights: [
    { fr: 'Point fort 1', en: 'Highlight 1' },
    { fr: 'Point fort 2', en: 'Highlight 2' },
  ],
  coverTagline: { fr: 'Accroche', en: 'Tagline' },
  context: 'b-her',
  roles: ['Backend', 'QA'],
  technologies: ['Spring Boot', 'Angular'],
  status: 'in-progress',
  visible: true,
  featured: true,
};

describe('CvProjects', () => {
  let fixture: ComponentFixture<CvProjects>;
  let compiled: HTMLElement;

  async function render(projects: Project[], lang: 'fr' | 'en' = 'fr'): Promise<void> {
    TestBed.inject(LanguageService).lang.set(lang);
    fixture = TestBed.createComponent(CvProjects);
    fixture.componentRef.setInput('projects', projects);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvProjects, provideTranslocoForTests()],
    }).compileComponents();
  });

  it('should display the role and the stack of each project', async () => {
    await render([PROJECT]);

    const facts = compiled.querySelector('.cv-projects__facts')!.textContent!;
    expect(facts).toContain('Backend, QA');
    expect(facts).toContain('Spring Boot, Angular');
  });

  it('should list the highlights in the current language', async () => {
    await render([PROJECT], 'en');

    const items = Array.from(compiled.querySelectorAll('.cv-projects__highlights li')).map((li) =>
      li.textContent!.trim(),
    );
    expect(items).toEqual(['Highlight 1', 'Highlight 2']);
  });

  it('should omit the stack and the highlights when there are none', async () => {
    await render([{ ...PROJECT, technologies: [], highlights: [] }]);

    expect(compiled.querySelectorAll('dt').length).toBe(1);
    expect(compiled.querySelector('.cv-projects__highlights')).toBeNull();
  });
});
