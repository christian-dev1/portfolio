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

  describe('details', () => {
    it('should display the name, the status and the summary of the project', async () => {
      await render(baseProject, 3);

      expect(compiled.querySelector('app-project-details h3')!.textContent).toContain('Vesty Shop');
      expect(text('.project-details__status')).toBe('En développement');
      expect(text('.project-details__summary')).toBe('Boutique de vêtements en ligne.');
    });
  });

  describe('block swap', () => {
    function article(): HTMLElement {
      return compiled.querySelector('.project-card')!;
    }

    async function dispatch(target: Element, event: Event): Promise<void> {
      target.dispatchEvent(event);
      await fixture.whenStable();
    }

    function pointer(type: string, pointerType: string): Event {
      return new PointerEvent(type, {
        bubbles: type !== 'pointerenter' && type !== 'pointerleave',
        pointerType,
      });
    }

    async function renderSwappable(project: Project = baseProject): Promise<void> {
      fixture = TestBed.createComponent(ProjectCard);
      fixture.componentRef.setInput('project', project);
      fixture.componentRef.setInput('swappable', true);
      compiled = fixture.nativeElement as HTMLElement;
      await fixture.whenStable();
    }

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should keep the normal layout when the card is not swappable', async () => {
      await render(baseProject);

      await dispatch(article(), pointer('pointerenter', 'mouse'));

      expect(article().classList).not.toContain('project-card--swapped');
    });

    it('should swap the blocks while the mouse is over the card', async () => {
      await renderSwappable();

      await dispatch(article(), pointer('pointerenter', 'mouse'));
      expect(article().classList).toContain('project-card--swapped');

      await dispatch(article(), pointer('pointerleave', 'mouse'));
      expect(article().classList).not.toContain('project-card--swapped');
    });

    it('should toggle the swap on each tap', async () => {
      await renderSwappable();
      const summary = compiled.querySelector('.project-details__summary')!;

      await dispatch(summary, pointer('pointerdown', 'touch'));
      await dispatch(summary, new MouseEvent('click', { bubbles: true }));
      expect(article().classList).toContain('project-card--swapped');

      await dispatch(summary, pointer('pointerdown', 'touch'));
      await dispatch(summary, new MouseEvent('click', { bubbles: true }));
      expect(article().classList).not.toContain('project-card--swapped');
    });

    it('should swap the blocks while the keyboard focus is in the card', async () => {
      await renderSwappable({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });
      const link = compiled.querySelector<HTMLElement>('.project-details__link')!;

      await dispatch(link, new FocusEvent('focusin', { bubbles: true }));
      expect(article().classList).toContain('project-card--swapped');

      await dispatch(link, new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
      expect(article().classList).not.toContain('project-card--swapped');
    });

    it('should keep the repository link clickable without swapping back on tap', async () => {
      await renderSwappable({ ...baseProject, repositoryUrl: 'https://gitlab.com/exemple' });
      const link = compiled.querySelector<HTMLAnchorElement>('.project-details__link')!;
      link.addEventListener('click', (event) => event.preventDefault());

      await dispatch(link, pointer('pointerdown', 'touch'));
      await dispatch(link, new MouseEvent('click', { bubbles: true, cancelable: true }));

      expect(article().classList).not.toContain('project-card--swapped');
    });

    it('should never swap when the user prefers reduced motion', async () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      await renderSwappable();

      await dispatch(article(), pointer('pointerenter', 'mouse'));

      expect(article().classList).not.toContain('project-card--swapped');
      expect(text('.project-details__summary')).toBe('Boutique de vêtements en ligne.');
    });
  });
});
