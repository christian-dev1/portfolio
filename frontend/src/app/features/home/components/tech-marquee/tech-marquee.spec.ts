import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Tool } from '../../../../shared/tools/models/tool.model';
import { TechMarquee } from './tech-marquee';

const TOOLS: Tool[] = [
  {
    id: 'docker',
    name: { fr: 'Docker', en: 'Docker' },
    icon: 'docker',
    category: 'environment',
    usedIn: [],
    visible: true,
  },
  {
    id: 'manual-testing',
    name: { fr: 'Tests manuels', en: 'Manual testing' },
    monogram: 'TM',
    category: 'testing',
    usedIn: [],
    visible: true,
  },
];

describe('TechMarquee', () => {
  let fixture: ComponentFixture<TechMarquee>;
  let compiled: HTMLElement;

  async function render(lang: 'fr' | 'en' = 'fr'): Promise<void> {
    TestBed.inject(LanguageService).lang.set(lang);
    fixture = TestBed.createComponent(TechMarquee);
    fixture.componentRef.setInput('tools', TOOLS);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechMarquee, provideTranslocoForTests()],
    }).compileComponents();
  });

  it('should give screen readers a plain list of the technologies', async () => {
    await render('en');

    const list = compiled.querySelector('ul.visually-hidden')!;
    const names = Array.from(list.querySelectorAll('li')).map((li) => li.textContent!.trim());
    expect(names).toEqual(['Docker', 'Manual testing']);
    expect(list.getAttribute('aria-label')!.trim()).not.toBe('');
  });

  it('should hide the moving track from assistive technologies', async () => {
    await render();

    expect(compiled.querySelector('.marquee__track')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should repeat the technologies twice so the loop is seamless', async () => {
    await render();

    const groups = compiled.querySelectorAll('.marquee__group');
    expect(groups.length).toBe(2);
    expect(groups[0].textContent).toBe(groups[1].textContent);
  });

  it('should show the logo when there is one, otherwise the monogram', async () => {
    await render();

    const items = compiled.querySelectorAll('.marquee__group:first-child .marquee__item');
    expect(items[0].querySelector('app-brand-icon')).not.toBeNull();
    expect(items[1].querySelector('.marquee__monogram')!.textContent).toBe('TM');
  });
});
