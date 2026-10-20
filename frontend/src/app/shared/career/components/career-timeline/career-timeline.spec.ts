import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { CareerEntry } from '../../models/career.model';
import { CareerTimeline } from './career-timeline';

const ENTRIES: CareerEntry[] = [
  {
    id: 'training',
    type: 'education',
    startYear: 2024,
    endYear: 2026,
    title: { fr: 'Formation', en: 'Training' },
    place: 'École',
    description: { fr: 'Description.', en: 'Description in English.' },
    visible: true,
  },
  {
    id: 'diploma',
    type: 'education',
    endYear: 2023,
    title: { fr: 'Diplôme', en: 'Diploma' },
    place: 'Lycée',
    visible: true,
  },
  {
    id: 'job',
    type: 'experience',
    startYear: 2022,
    endYear: 2023,
    title: { fr: 'Vendeur', en: 'Sales assistant' },
    place: 'Boutique',
    visible: true,
  },
];

describe('CareerTimeline', () => {
  let fixture: ComponentFixture<CareerTimeline>;
  let compiled: HTMLElement;

  async function render(lang: 'fr' | 'en' = 'fr'): Promise<void> {
    TestBed.inject(LanguageService).lang.set(lang);
    fixture = TestBed.createComponent(CareerTimeline);
    fixture.componentRef.setInput('entries', ENTRIES);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function texts(selector: string): string[] {
    return Array.from(compiled.querySelectorAll(selector)).map((el) => el.textContent!.trim());
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerTimeline, provideTranslocoForTests()],
    }).compileComponents();
  });

  it('should display one item per entry, in the given order', async () => {
    await render();

    expect(texts('.timeline__title')).toEqual(['Formation', 'Diplôme', 'Vendeur']);
  });

  it('should display a year range, or a single year when there is no start year', async () => {
    await render();

    expect(texts('.timeline__years')).toEqual(['2024 – 2026', '2023', '2022 – 2023']);
  });

  it('should display the translated type and the place', async () => {
    await render();

    const meta = texts('.timeline__meta');
    expect(meta[0]).toContain('Formation');
    expect(meta[0]).toContain('École');
    expect(meta[2]).toContain('Expérience');
  });

  it('should display the description only when there is one', async () => {
    await render('en');

    expect(texts('.timeline__description')).toEqual(['Description in English.']);
  });

  it('should hide the decorative dots from assistive technologies', async () => {
    await render();

    compiled
      .querySelectorAll('.timeline__dot')
      .forEach((dot) => expect(dot.getAttribute('aria-hidden')).toBe('true'));
  });
});
