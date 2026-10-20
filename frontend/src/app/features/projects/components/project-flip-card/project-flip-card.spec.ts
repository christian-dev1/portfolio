import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { ProjectFlipCard } from './project-flip-card';

const PROJECT: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Application de transfert d’argent.', en: 'Money transfer application.' },
  highlights: [{ fr: 'Conçu de A à Z', en: 'Built end to end' }],
  coverTagline: { fr: 'XAF ⇄ EUR', en: 'XAF ⇄ EUR' },
  context: 'b-her',
  roles: ['Backend'],
  technologies: ['Spring Boot'],
  status: 'in-progress',
  repositoryUrl: 'https://gitlab.com/exemple/wimo',
  visible: true,
  featured: true,
};

describe('ProjectFlipCard', () => {
  let fixture: ComponentFixture<ProjectFlipCard>;
  let compiled: HTMLElement;

  async function render(project: Project = PROJECT): Promise<void> {
    fixture = TestBed.createComponent(ProjectFlipCard);
    fixture.componentRef.setInput('project', project);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  async function dispatch(target: Element, event: Event): Promise<void> {
    target.dispatchEvent(event);
    await fixture.whenStable();
  }

  function card(): HTMLElement {
    return compiled.querySelector('.flip-card')!;
  }

  function toggle(): HTMLButtonElement {
    return compiled.querySelector('.flip-card__toggle')!;
  }

  function link(): HTMLAnchorElement {
    return compiled.querySelector('.flip-card__back a')!;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFlipCard, provideTranslocoForTests()],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('front', () => {
    it('should show the folder tab and the initials when there is no logo', async () => {
      await render();

      expect(compiled.querySelector('.flip-card__tab')!.textContent!.trim()).toBe('B-HER EMPIRE');
      expect(compiled.querySelector('.flip-card__initials')!.textContent!.trim()).toBe('W');
      expect(compiled.querySelector('.flip-card__front')!.classList).toContain('brand-pattern');
    });

    it('should show the logo when there is one', async () => {
      await render({ ...PROJECT, logoUrl: '/images/projects/logo.png' });

      expect(compiled.querySelector('.flip-card__logo')!.getAttribute('src')).toBe(
        '/images/projects/logo.png',
      );
      expect(compiled.querySelector('.flip-card__front')!.classList).toContain('brand-pattern');
    });

    it('should give the project name to screen readers on the front', async () => {
      await render();

      expect(toggle().querySelector('.visually-hidden')!.textContent!.trim()).toBe('WIMO');
    });

    it('should show translated hints for mouse and touch users', async () => {
      TestBed.inject(LanguageService).lang.set('en');
      await render();

      expect(compiled.querySelector('.flip-card__hint-text--hover')!.textContent!.trim()).toBe(
        'Hover to discover the project',
      );
      expect(compiled.querySelector('.flip-card__hint-text--touch')!.textContent!.trim()).toBe(
        'Tap to discover the project',
      );
    });
  });

  describe('back', () => {
    it('should keep the details readable by screen readers on the back', async () => {
      await render();

      const back = compiled.querySelector('.flip-card__back')!;
      expect(back.getAttribute('aria-hidden')).toBeNull();
      expect(back.querySelector('h2')!.textContent).toContain('WIMO');
      expect(back.textContent).toContain('Application de transfert d’argent.');
      expect(link().textContent).toContain('Voir le code');
    });

    it('should mention private code for a team project without repository', async () => {
      await render({ ...PROJECT, context: 'collaboration', repositoryUrl: undefined });

      expect(compiled.querySelector('.flip-card__back')!.textContent).toContain('Code non public');
    });
  });

  describe('flip', () => {
    it('should show the front, unpressed, with the back link out of the tab order', async () => {
      await render();

      expect(card().classList).not.toContain('flip-card--flipped');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');
      expect(link().getAttribute('tabindex')).toBe('-1');
    });

    it('should flip while the mouse is over the card', async () => {
      await render();

      await dispatch(card(), new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      expect(card().classList).toContain('flip-card--flipped');

      await dispatch(card(), new PointerEvent('pointerleave', { pointerType: 'mouse' }));
      expect(card().classList).not.toContain('flip-card--flipped');
    });

    it('should fade back without rotating and reset after the fade', async () => {
      await render();
      await dispatch(card(), new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      await dispatch(card(), new PointerEvent('pointerleave', { pointerType: 'mouse' }));
      expect(card().classList).toContain('flip-card--returning');
      expect(link().getAttribute('tabindex')).toBe('-1');
      await new Promise((resolve) => setTimeout(resolve, 950));
      await fixture.whenStable();
      expect(card().classList).not.toContain('flip-card--returning');
    });

    it('should cancel a pending fade when the pointer enters again', async () => {
      await render();
      await dispatch(card(), new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      await dispatch(card(), new PointerEvent('pointerleave', { pointerType: 'mouse' }));
      await dispatch(card(), new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      expect(card().classList).toContain('flip-card--flipped');
      expect(card().classList).not.toContain('flip-card--returning');
    });

    it('should flip on keyboard focus and make the back link reachable', async () => {
      await render();

      await dispatch(toggle(), new FocusEvent('focusin', { bubbles: true }));

      expect(card().classList).toContain('flip-card--flipped');
      expect(toggle().getAttribute('aria-pressed')).toBe('true');
      expect(link().hasAttribute('tabindex')).toBe(false);
    });

    it('should stay flipped while the focus moves to the back link, then flip back', async () => {
      await render();
      await dispatch(toggle(), new FocusEvent('focusin', { bubbles: true }));

      await dispatch(
        toggle(),
        new FocusEvent('focusout', { bubbles: true, relatedTarget: link() }),
      );
      expect(card().classList).toContain('flip-card--flipped');

      await dispatch(link(), new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
      expect(card().classList).not.toContain('flip-card--flipped');
    });

    it('should toggle on each tap and reflect it with aria-pressed', async () => {
      await render();

      await dispatch(
        toggle(),
        new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
      );
      await dispatch(toggle(), new FocusEvent('focusin', { bubbles: true }));
      await dispatch(toggle(), new MouseEvent('click', { bubbles: true }));
      expect(card().classList).toContain('flip-card--flipped');
      expect(toggle().getAttribute('aria-pressed')).toBe('true');

      const back = compiled.querySelector('.flip-card__back p')!;
      await dispatch(
        back,
        new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }),
      );
      await dispatch(toggle(), new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
      await dispatch(back, new MouseEvent('click', { bubbles: true }));
      expect(card().classList).not.toContain('flip-card--flipped');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');
    });

    it('should let the keyboard flip the card back with Enter or Space', async () => {
      await render();
      await dispatch(toggle(), new FocusEvent('focusin', { bubbles: true }));

      // Entrée / Espace sur un bouton déclenchent un clic sans pointeur.
      await dispatch(toggle(), new MouseEvent('click', { bubbles: true }));

      expect(card().classList).not.toContain('flip-card--flipped');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('reduced motion', () => {
    beforeEach(() => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
    });

    it('should show only the original card with reduced motion', async () => {
      await render();

      expect(card().classList).toContain('flip-card--unfolded');
      expect(compiled.querySelector('.flip-card__toggle')).toBeNull();
      expect(compiled.querySelector('.flip-card__front')).toBeNull();
      expect(compiled.querySelector('.flip-card__back')!.textContent).toContain(
        'Application de transfert d’argent.',
      );
      expect(link().hasAttribute('tabindex')).toBe(false);
    });

    it('should never flip', async () => {
      await render();

      await dispatch(card(), new PointerEvent('pointerenter', { pointerType: 'mouse' }));

      expect(card().classList).not.toContain('flip-card--flipped');
    });
  });
});
