import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../testing/transloco-testing';
import { LanguageService } from '../../../core/i18n/language.service';
import { PageBanner } from './page-banner';

describe('PageBanner', () => {
  let fixture: ComponentFixture<PageBanner>;
  let compiled: HTMLElement;

  async function render(count?: number): Promise<void> {
    fixture = TestBed.createComponent(PageBanner);
    // N'importe quelles clés existantes conviennent : le composant ne fait que les traduire.
    fixture.componentRef.setInput('eyebrowKey', 'nav.home');
    fixture.componentRef.setInput('titleKey', 'projects.title');
    fixture.componentRef.setInput('introKey', 'projects.intro');
    fixture.componentRef.setInput('countLabelKey', 'nav.tools');
    if (count !== undefined) {
      fixture.componentRef.setInput('count', count);
    }
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageBanner, provideTranslocoForTests()],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
  });

  it('should display the translated title in the only h1', async () => {
    await render(4);

    const titles = compiled.querySelectorAll('h1');
    expect(titles.length).toBe(1);
    expect(titles[0].textContent).toContain('Projets');
  });

  it('should display the eyebrow and the intro', async () => {
    await render(4);

    expect(compiled.querySelector('.page-banner__eyebrow')!.textContent).toContain('Accueil');
    expect(compiled.querySelector('.page-banner__intro')!.textContent).toContain(
      'Les applications que je conçois',
    );
  });

  it('should display the count on two digits with its label', async () => {
    await render(4);

    expect(compiled.querySelector('.page-banner__count')!.textContent).toBe('04');
    expect(compiled.querySelector('.page-banner__count-label')!.textContent).toContain('Outils');
  });

  it('should hide the decorative counter from assistive technologies', async () => {
    await render(12);

    const counter = compiled.querySelector('.page-banner__counter')!;
    expect(counter.getAttribute('aria-hidden')).toBe('true');
    expect(compiled.querySelector('.page-banner__count')!.textContent).toBe('12');
  });

  it('should not display the counter while the count is unknown', async () => {
    await render();

    expect(compiled.querySelector('.page-banner__counter')).toBeNull();
  });

  it('should end with a decorative red band', async () => {
    await render(4);

    expect(compiled.querySelector('.page-banner__band')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not display a counter on a page without count label', async () => {
    fixture = TestBed.createComponent(PageBanner);
    fixture.componentRef.setInput('eyebrowKey', 'nav.home');
    fixture.componentRef.setInput('titleKey', 'projects.title');
    fixture.componentRef.setInput('introKey', 'projects.intro');
    fixture.componentRef.setInput('count', 3);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    expect(compiled.querySelector('.page-banner__counter')).toBeNull();
  });
});
