import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { Lang, LanguageService } from '../../../../core/i18n/language.service';
import { CvPdfService } from '../../../../shared/contact-config/data-access/cv-pdf.service';
import { LocalizedText } from '../../../../shared/i18n/localized-text';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { Profile } from '../../../../shared/profile/models/profile.model';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { Tool } from '../../../../shared/tools/models/tool.model';
import { HomePage } from './home-page';

const featuredProject: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
  highlights: [],
  coverTagline: { fr: 'Accroche', en: 'Tagline' },
  context: 'b-her',
  roles: ['Backend'],
  technologies: ['Spring Boot'],
  status: 'in-progress',
  visible: true,
  featured: true,
};

const WITH_ALL_NETWORKS: Profile = {
  ...PROFILE_FIXTURE,
  socialLinks: PROFILE_FIXTURE.socialLinks.map((link) =>
    link.url ? link : { ...link, url: `https://example.com/${link.network}` },
  ),
};

const otherProject: Project = { ...featuredProject, id: 'other', name: 'Other', featured: false };

function tool(id: string): Tool {
  return {
    id,
    name: { fr: id, en: id },
    category: 'backend',
    usedIn: [],
    visible: true,
  };
}

async function setup(
  options: {
    projects$?: Observable<Project[]>;
    profile?: Profile;
    lang?: 'fr' | 'en';
    /** PDF existants par langue (ce que renvoie `CvPdfService`). */
    cvPdf?: LocalizedText;
  } = {},
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [HomePage, provideTranslocoForTests()],
    providers: [
      provideRouter([]),
      {
        provide: ProfileService,
        useValue: { getProfile: () => of(options.profile ?? PROFILE_FIXTURE) },
      },
      {
        provide: ProjectService,
        useValue: {
          getPublicProjects: () => options.projects$ ?? of([featuredProject, otherProject]),
        },
      },
      {
        provide: ToolService,
        useValue: { getPublicTools: () => of([tool('java'), tool('docker'), tool('git')]) },
      },
      {
        provide: CvPdfService,
        useValue: { getAvailableUrl: (lang: Lang) => of(options.cvPdf?.[lang] ?? '') },
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

    const cta = compiled.querySelector('.hero__actions .button--primary')!;
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
    const compiled = await setup({ projects$: of([otherProject]) });

    expect(compiled.textContent).toContain('Aucun projet mis en avant pour le moment.');
  });

  it('should display a loading message while featured projects are loading', async () => {
    const compiled = await setup({ projects$: NEVER });

    expect(compiled.querySelector('.featured')!.textContent).toContain('Chargement des projets');
  });

  it('should link to all projects from the featured section', async () => {
    const compiled = await setup();

    const seeAll = compiled.querySelector('.featured__see-all')!;
    expect(seeAll.getAttribute('href')).toBe('/projets');
  });

  it('should display the availability badge in the blue zone', async () => {
    const compiled = await setup();

    const badge = compiled.querySelector('.hero__banner app-availability-badge')!;
    expect(badge.textContent).toContain('Disponible à distance');
  });

  it('should no longer display a "current focus" line', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('.hero__focus')).toBeNull();
    expect(compiled.textContent).not.toContain('En ce moment');
  });

  it('should no longer display the scrolling tech ribbon', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('app-tech-marquee')).toBeNull();
    expect(compiled.querySelector('.home__marquee')).toBeNull();
  });

  it('should list the visible technologies for screen readers in the hero', async () => {
    const compiled = await setup();

    const list = compiled.querySelector('.hero ul.visually-hidden')!;
    const names = Array.from(list.querySelectorAll('li')).map((li) => li.textContent!.trim());
    expect(names).toEqual(['java', 'docker', 'git']);
    expect(list.getAttribute('aria-label')).toBe("Technologies que j'utilise");
  });

  it('should add the decorative orbiting logos to the hero, hidden from screen readers', async () => {
    const compiled = await setup();

    const orbit = compiled.querySelector('.hero app-band-orbit')!;
    expect(orbit.getAttribute('aria-hidden')).toBe('true');
  });

  it('should only show LinkedIn, GitHub, GitLab and email in the blue zone', async () => {
    const compiled = await setup({ profile: WITH_ALL_NETWORKS });

    const hrefs = Array.from(compiled.querySelectorAll('.hero__banner app-social-links a')).map(
      (link) => link.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      'https://example.com/linkedin',
      'https://github.com/example',
      'https://gitlab.com/example',
      'mailto:contact@example.com',
    ]);
  });

  it('should compute the key figures from the visible projects and tools', async () => {
    const compiled = await setup();

    const figures = compiled.querySelector('app-key-figures')!.textContent!.replace(/\s+/g, ' ');
    expect(figures).toContain('02 projets');
    expect(figures).toContain('03 outils');
    expect(figures).toContain('B-HER EMPIRE');
  });

  it('should only show featured projects in the featured section', async () => {
    const compiled = await setup();

    const names = Array.from(compiled.querySelectorAll('.featured h3')).map((h3) =>
      h3.textContent!.trim(),
    );
    expect(names).toEqual(['WIMO']);
  });

  it('should hide the CV download button while there is no PDF for the current language', async () => {
    const compiled = await setup({ cvPdf: { fr: '', en: '/cv/cv-en.pdf' } });

    expect(compiled.querySelector('.hero__cv a')).toBeNull();
  });

  it('should offer to download the CV of the current language when there is one', async () => {
    const compiled = await setup({ cvPdf: { fr: '/cv/cv-fr.pdf', en: '' } });

    const button = compiled.querySelector('.hero__cv a')!;
    expect(button.getAttribute('href')).toBe('/cv/cv-fr.pdf');
    expect(button.hasAttribute('download')).toBe(true);
    expect(button.textContent).toContain('Télécharger mon CV');
  });
});
