import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { LanguageService } from '../../../../core/i18n/language.service';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { CareerEntry } from '../../../../shared/career/models/career.model';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { AboutPage } from './about-page';

const CAREER: CareerEntry[] = [
  {
    id: 'training',
    type: 'education',
    startYear: 2024,
    endYear: 2026,
    title: { fr: 'Formation', en: 'Training' },
    place: 'École',
    visible: true,
  },
];

async function setup(
  career$: Observable<CareerEntry[]> = of(CAREER),
  lang: 'fr' | 'en' = 'fr',
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [AboutPage, provideTranslocoForTests()],
    providers: [
      { provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } },
      { provide: CareerService, useValue: { getCareer: () => career$ } },
    ],
  });

  TestBed.inject(LanguageService).lang.set(lang);
  const fixture = TestBed.createComponent(AboutPage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('AboutPage', () => {
  it('should have a single h1, in the page banner', async () => {
    const compiled = await setup();

    const titles = compiled.querySelectorAll('h1');
    expect(titles.length).toBe(1);
    expect(titles[0].closest('app-page-banner')).not.toBeNull();
  });

  it('should display every bio paragraph and the location', async () => {
    const compiled = await setup(of(CAREER), 'en');

    const text = compiled.querySelector('.about__bio')!.textContent!;
    expect(text).toContain('First paragraph.');
    expect(text).toContain('Second paragraph.');
    expect(text).toContain('City, Country');
  });

  it('should display the photo with a translated alt text', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('.about__photo')!.getAttribute('alt')).toBe(
      'Photo de Christian Luther',
    );
  });

  it('should display one card per value', async () => {
    const compiled = await setup();

    const titles = Array.from(compiled.querySelectorAll('.about__value h3')).map((h3) =>
      h3.textContent!.trim(),
    );
    expect(titles).toEqual(['Oser', 'Engagement']);
  });

  it('should present the company with its role and description', async () => {
    const compiled = await setup();

    const company = compiled.querySelector('.about__company')!.textContent!;
    expect(company).toContain('B-HER EMPIRE');
    expect(company).toContain('Fondateur');
    expect(company).toContain('Description de la société.');
  });

  it('should display the career timeline', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('app-career-timeline .timeline__title')!.textContent).toContain(
      'Formation',
    );
  });
});
