import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { HomePage } from './home-page';

const featuredProject: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
  coverTagline: { fr: 'Accroche', en: 'Tagline' },
  context: 'b-her',
  roles: ['Backend'],
  technologies: ['Spring Boot'],
  status: 'in-progress',
  visible: true,
  featured: true,
};

async function setup(
  options: { featured$?: Observable<Project[]>; lang?: 'fr' | 'en' } = {},
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [HomePage, provideTranslocoForTests()],
    providers: [
      provideRouter([]),
      { provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } },
      {
        provide: ProjectService,
        useValue: { getFeaturedProjects: () => options.featured$ ?? of([featuredProject]) },
      },
    ],
  });

  TestBed.inject(LanguageService).lang.set(options.lang ?? 'fr');
  const fixture = TestBed.createComponent(HomePage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('HomePage', () => {
  it('should have exactly one h1 displaying the brand', async () => {
    const compiled = await setup();

    const titles = compiled.querySelectorAll('h1');
    expect(titles.length).toBe(1);
    expect(titles[0].textContent).toContain('LUCHRIST');
  });

  it('should display the full name and the job title', async () => {
    const compiled = await setup();

    expect(compiled.textContent).toContain('Noutchom Noumbiap Christian Luther');
    expect(compiled.textContent).toContain('Développeur Backend & QA');
  });

  it('should display the founder pill', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('.hero__founder')!.textContent).toContain(
      'Fondateur · B-HER EMPIRE',
    );
  });

  it('should display the slogan and the description from the profile', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('.hero__slogan')!.textContent).toContain('Slogan en français.');
    expect(compiled.querySelector('.hero__description')!.textContent).toContain(
      'Description en français.',
    );
  });

  it('should display the slogan and the description in English when the language is English', async () => {
    const compiled = await setup({ lang: 'en' });

    expect(compiled.textContent).toContain('Slogan in English.');
    expect(compiled.textContent).toContain('Description in English.');
    expect(compiled.textContent).toContain('Founder · B-HER EMPIRE');
  });

  it('should link to GitLab, GitHub and the email address from the profile', async () => {
    const compiled = await setup();

    const banner = compiled.querySelector('.hero__banner')!;
    expect(banner.querySelector('a[href="https://gitlab.com/example"]')).not.toBeNull();
    expect(banner.querySelector('a[href="https://github.com/example"]')).not.toBeNull();
    expect(banner.querySelector('a[href="mailto:contact@example.com"]')).not.toBeNull();
  });

  it('should display the photo with a translated alt text and explicit dimensions', async () => {
    const compiled = await setup();

    const photo = compiled.querySelector('.hero__photo img')!;
    expect(photo.getAttribute('src')).toBe('/images/photo-test.jpg');
    expect(photo.getAttribute('alt')).toBe('Photo de Christian Luther');
    expect(photo.getAttribute('width')).toBe('184');
    expect(photo.getAttribute('height')).toBe('184');
  });

  it('should display the initials when the photo cannot be loaded', async () => {
    const compiled = await setup();
    const photo = compiled.querySelector('.hero__photo img')!;

    photo.dispatchEvent(new Event('error'));
    await TestBed.inject(ApplicationRef).whenStable();

    expect(compiled.querySelector('.hero__photo img')).toBeNull();
    expect(compiled.querySelector('.hero__initials')!.textContent!.trim()).toBe('CL');
  });

  it('should link the main button to the projects page', async () => {
    const compiled = await setup();

    const cta = compiled.querySelector('.hero__cta')!;
    expect(cta.getAttribute('href')).toBe('/projets');
    expect(cta.textContent).toContain('Voir mes projets');
  });

  it('should display the featured projects as cards with level 3 headings', async () => {
    const compiled = await setup();

    const cards = compiled.querySelectorAll('.featured app-project-card');
    expect(cards.length).toBe(1);
    expect(cards[0].querySelector('h3')!.textContent).toContain('WIMO');
  });

  it('should display a message when there is no featured project', async () => {
    const compiled = await setup({ featured$: of([]) });

    expect(compiled.textContent).toContain('Aucun projet mis en avant pour le moment.');
  });

  it('should display a loading message while featured projects are loading', async () => {
    const compiled = await setup({ featured$: NEVER });

    expect(compiled.querySelector('.featured')!.textContent).toContain('Chargement des projets');
  });

  it('should link to all projects from the featured section', async () => {
    const compiled = await setup();

    const seeAll = compiled.querySelector('.featured__see-all')!;
    expect(seeAll.getAttribute('href')).toBe('/projets');
  });
});
