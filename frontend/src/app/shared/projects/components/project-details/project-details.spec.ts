import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Project } from '../../models/project.model';
import { ProjectDetails } from './project-details';

const baseProject: Project = {
  id: 'vesty-shop',
  name: 'Vesty Shop',
  summary: { fr: 'Boutique de vêtements en ligne.', en: 'Online clothing store.' },
  highlights: [
    { fr: 'Projet réalisé seul', en: 'Built on my own' },
    { fr: 'Commandes sur mesure', en: 'Made-to-measure orders' },
  ],
  coverTagline: { fr: 'Prêt-à-porter', en: 'Ready-to-wear' },
  context: 'b-her',
  roles: ['Backend', 'QA'],
  technologies: ['Spring Boot', 'Angular'],
  status: 'in-progress',
  visible: true,
  featured: false,
};

describe('ProjectDetails', () => {
  let fixture: ComponentFixture<ProjectDetails>;
  let compiled: HTMLElement;
  let language: LanguageService;

  async function render(project: Project, headingLevel?: 2 | 3): Promise<void> {
    fixture = TestBed.createComponent(ProjectDetails);
    fixture.componentRef.setInput('project', project);
    if (headingLevel) {
      fixture.componentRef.setInput('headingLevel', headingLevel);
    }
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function text(selector: string): string {
    return compiled.querySelector(selector)?.textContent?.trim() ?? '';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetails, provideTranslocoForTests()],
    }).compileComponents();

    language = TestBed.inject(LanguageService);
    language.lang.set('fr');
  });

  describe('header', () => {
    it('should display the name in a level 2 heading by default', async () => {
      await render(baseProject);

      expect(compiled.querySelector('h2')!.textContent).toContain('Vesty Shop');
      expect(compiled.querySelector('h3')).toBeNull();
    });

    it('should use a level 3 heading when asked to', async () => {
      await render(baseProject, 3);

      expect(compiled.querySelector('h2')).toBeNull();
      expect(compiled.querySelector('h3')!.textContent).toContain('Vesty Shop');
    });

    it('should display the translated status', async () => {
      await render({ ...baseProject, status: 'pilot' });

      expect(text('.project-details__status')).toBe('En phase pilote');
    });
  });

  describe('body', () => {
    it('should display the summary in the current language', async () => {
      language.lang.set('en');

      await render(baseProject);

      expect(text('.project-details__summary')).toBe('Online clothing store.');
    });

    it('should list roles and stack as definitions', async () => {
      await render(baseProject);

      const terms = Array.from(compiled.querySelectorAll('dt')).map((dt) => dt.textContent!.trim());
      expect(terms).toEqual(['Rôle', 'Stack']);
      expect(compiled.querySelectorAll('.project-details__chips li').length).toBe(4);
    });

    it('should hide the stack when there is no technology', async () => {
      await render({ ...baseProject, technologies: [] });

      expect(compiled.querySelectorAll('dt').length).toBe(1);
    });
  });

  describe('highlights', () => {
    it('should list the highlights in the current language', async () => {
      language.lang.set('en');

      await render(baseProject);

      const items = Array.from(compiled.querySelectorAll('.project-details__highlights li')).map(
        (li) => li.textContent!.trim(),
      );
      expect(items).toEqual(['Built on my own', 'Made-to-measure orders']);
    });

    it('should give the highlights list an accessible name', async () => {
      await render(baseProject);

      expect(
        compiled.querySelector('.project-details__highlights')!.getAttribute('aria-label'),
      ).toBe('Points forts');
    });

    it('should not render an empty list when there is no highlight', async () => {
      await render({ ...baseProject, highlights: [] });

      expect(compiled.querySelector('.project-details__highlights')).toBeNull();
    });
  });

  describe('footer', () => {
    it('should link to the repository safely in a new tab', async () => {
      await render({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });

      const link = compiled.querySelector('.project-details__footer a')!;
      expect(link.getAttribute('href')).toBe('https://gitlab.com/exemple');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.textContent).toContain('Voir le code');
    });

    it('should mention private code for a team project without repository', async () => {
      await render({ ...baseProject, context: 'collaboration' });

      expect(text('.project-details__footer')).toBe('Code non public (projet en équipe)');
    });

    it('should not display a footer for a B-HER project without repository', async () => {
      await render(baseProject);

      expect(compiled.querySelector('.project-details__footer')).toBeNull();
    });
  });

  describe('focus order', () => {
    it('should keep the repository link in the tab order by default', async () => {
      await render({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });

      expect(compiled.querySelector('.project-details__link')!.hasAttribute('tabindex')).toBe(
        false,
      );
    });

    it('should take the repository link out of the tab order when asked to', async () => {
      fixture = TestBed.createComponent(ProjectDetails);
      fixture.componentRef.setInput('project', {
        ...baseProject,
        repositoryUrl: 'https://gitlab.com/exemple',
      });
      fixture.componentRef.setInput('linksFocusable', false);
      compiled = fixture.nativeElement as HTMLElement;
      await fixture.whenStable();

      expect(compiled.querySelector('.project-details__link')!.getAttribute('tabindex')).toBe('-1');
    });
  });
});
