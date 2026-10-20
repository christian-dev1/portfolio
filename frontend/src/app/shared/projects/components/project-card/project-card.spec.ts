import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProjectCard } from './project-card';
import { Project } from '../../models/project.model';

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

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>;
  let compiled: HTMLElement;
  let language: LanguageService;

  async function render(project: Project, headingLevel?: 2 | 3): Promise<void> {
    fixture = TestBed.createComponent(ProjectCard);
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
      imports: [ProjectCard, provideTranslocoForTests()],
    }).compileComponents();

    language = TestBed.inject(LanguageService);
    language.lang.set('fr');
  });

  describe('folder tab', () => {
    it('should show a red B-HER EMPIRE tab for a B-HER project', async () => {
      await render(baseProject);

      expect(text('.project-card__tab')).toBe('B-HER EMPIRE');
      expect(compiled.querySelector('.project-card--team')).toBeNull();
    });

    it('should show a blue team tab for a collaboration project', async () => {
      await render({ ...baseProject, context: 'collaboration' });

      expect(text('.project-card__tab')).toBe('Projet en équipe');
      expect(compiled.querySelector('.project-card--team')).not.toBeNull();
    });
  });

  describe('cover', () => {
    it('should generate a decorative cover with the name and the tagline when there is no image', async () => {
      await render(baseProject);

      const generated = compiled.querySelector('.project-card__cover-generated')!;
      expect(generated.getAttribute('aria-hidden')).toBe('true');
      expect(generated.textContent).toContain('Vesty Shop');
      expect(generated.textContent).toContain('Prêt-à-porter');
      expect(compiled.querySelector('.project-card__cover-image')).toBeNull();
    });

    it('should display the cover image with a translated alt text when there is one', async () => {
      await render({ ...baseProject, coverUrl: '/images/projects/cover.jpg' });

      const image = compiled.querySelector('.project-card__cover-image')!;
      expect(image.getAttribute('src')).toBe('/images/projects/cover.jpg');
      expect(image.getAttribute('alt')).toBe("Page d'accueil de Vesty Shop");
      expect(compiled.querySelector('.project-card__cover-generated')).toBeNull();
    });

    it('should translate the cover alt text', async () => {
      language.lang.set('en');

      await render({ ...baseProject, coverUrl: '/images/projects/cover.jpg' });

      expect(compiled.querySelector('.project-card__cover-image')!.getAttribute('alt')).toBe(
        'Vesty Shop home page',
      );
    });

    it('should translate the tagline', async () => {
      language.lang.set('en');

      await render(baseProject);

      expect(text('.project-card__cover-tagline')).toBe('Ready-to-wear');
    });
  });

  describe('emblem', () => {
    it('should display the initials when there is no logo', async () => {
      await render(baseProject);

      expect(text('.project-card__emblem')).toBe('VS');
      expect(compiled.querySelector('.project-card__emblem img')).toBeNull();
    });

    it('should display the logo with the project name as alt text when there is one', async () => {
      await render({ ...baseProject, logoUrl: '/images/projects/logo.png' });

      const logo = compiled.querySelector('.project-card__emblem img')!;
      expect(logo.getAttribute('src')).toBe('/images/projects/logo.png');
      expect(logo.getAttribute('alt')).toBe('Vesty Shop');
      expect(compiled.querySelector('.project-card__initials')).toBeNull();
    });

    it('should let a logo fill the emblem without the light inner border', async () => {
      await render({ ...baseProject, logoUrl: '/images/projects/logo.png' });

      expect(compiled.querySelector('.project-card__emblem--logo')).not.toBeNull();
    });

    it('should keep the inner border around the initials', async () => {
      await render(baseProject);

      expect(compiled.querySelector('.project-card__emblem--logo')).toBeNull();
    });
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

      expect(text('.project-card__status')).toBe('En phase pilote');
    });
  });

  describe('body', () => {
    it('should display the summary in the current language', async () => {
      language.lang.set('en');

      await render(baseProject);

      expect(text('.project-card__summary')).toBe('Online clothing store.');
    });

    it('should list roles and stack as definitions', async () => {
      await render(baseProject);

      const terms = Array.from(compiled.querySelectorAll('dt')).map((dt) => dt.textContent!.trim());
      expect(terms).toEqual(['Rôle', 'Stack']);
      expect(compiled.querySelectorAll('.project-card__chips li').length).toBe(4);
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

      const items = Array.from(compiled.querySelectorAll('.project-card__highlights li')).map(
        (li) => li.textContent!.trim(),
      );
      expect(items).toEqual(['Built on my own', 'Made-to-measure orders']);
    });

    it('should give the highlights list an accessible name', async () => {
      await render(baseProject);

      expect(compiled.querySelector('.project-card__highlights')!.getAttribute('aria-label')).toBe(
        'Points forts',
      );
    });

    it('should not render an empty list when there is no highlight', async () => {
      await render({ ...baseProject, highlights: [] });

      expect(compiled.querySelector('.project-card__highlights')).toBeNull();
    });
  });

  describe('footer', () => {
    it('should link to the repository safely in a new tab', async () => {
      await render({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });

      const link = compiled.querySelector('.project-card__footer a')!;
      expect(link.getAttribute('href')).toBe('https://gitlab.com/exemple');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.textContent).toContain('Voir le code');
    });

    it('should mention private code for a team project without repository', async () => {
      await render({ ...baseProject, context: 'collaboration' });

      expect(text('.project-card__footer')).toBe('Code non public (projet en équipe)');
    });

    it('should not display a footer for a B-HER project without repository', async () => {
      await render(baseProject);

      expect(compiled.querySelector('.project-card__footer')).toBeNull();
    });
  });
});
