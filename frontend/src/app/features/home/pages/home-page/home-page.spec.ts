import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { NEVER, Observable, Subject, of } from 'rxjs';
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
    cvPdf$?: Partial<Record<Lang, Observable<string>>>;
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
        useValue: {
          getAvailableUrl: (lang: Lang) =>
            options.cvPdf$?.[lang] ?? of(options.cvPdf?.[lang] ?? ''),
        },
      },
    ],
  });

  TestBed.inject(TranslocoService).config.reRenderOnLangChange = true;
  TestBed.inject(LanguageService).lang.set(options.lang ?? 'fr');
  const fixture = TestBed.createComponent(HomePage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('HomePage', () => {
  it('should use the profile slogan as the only h1', async () => {
    const page = await setup();
    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('h1')!.textContent).toContain('Slogan en français.');
    expect(page.querySelector('.hero__description')!.textContent).toContain(
      'Description en français.',
    );
    expect(page.querySelector('.hero__eyebrow')!.textContent).toContain(
      'Développeur Backend & QA · Fondateur de B-HER EMPIRE',
    );
  });

  it.each(['fr', 'en'] as const)(
    'should translate the manifesto and final contact in %s',
    async (lang) => {
      const page = await setup({ lang });
      const text = page.textContent!.replace(/\s+/g, ' ');
      expect(text).toContain(
        lang === 'fr'
          ? "Je ne dis pas “je ne peux pas”. J'ose, et je rêve grand."
          : "I never say “I can't”. I dare, and I dream big.",
      );
      expect(text).toContain(lang === 'fr' ? 'Parlons-en.' : "Let's talk.");
      expect(text).toContain(
        lang === 'fr'
          ? 'Un message, WhatsApp, ou le CV en un clic.'
          : 'A message, WhatsApp, or the CV in one click.',
      );
      const contact = page.querySelector('.home-contact a')!;
      expect(contact.getAttribute('href')).toBe('/contact');
      expect(contact.textContent!.trim()).toBe('Contact');
    },
  );

  it('should keep projects as the only primary action in the opening', async () => {
    const page = await setup();
    const buttons = page.querySelectorAll('.hero__opening .button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('href')).toBe('/projets');
    expect(buttons[0].textContent).toContain('Voir mes projets');
  });

  it('should leave all social links out of the opening', async () => {
    const page = await setup({ profile: WITH_ALL_NETWORKS });
    expect(page.querySelector('app-social-links')).toBeNull();
    expect(page.querySelector('.hero__opening a[href^="https://"]')).toBeNull();
  });

  it('should reuse the portrait, its fallback and decorative orbit below the opening', async () => {
    const page = await setup();
    const photo = page.querySelector('.hero__photo img')!;
    expect(photo.getAttribute('src')).toBe('/images/photo-test.jpg');
    expect(photo.getAttribute('alt')).toBe('Photo de Christian Luther');
    expect(photo.getAttribute('width')).toBe('184');
    expect(page.querySelector('.hero__orbit app-band-orbit')!.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(page.querySelector('.hero__full-name')!.textContent).toContain(
      'Noutchom Noumbiap Christian Luther',
    );
    const names = Array.from(page.querySelectorAll('.hero__orbit ul.visually-hidden li'), (li) =>
      li.textContent!.trim(),
    );
    expect(names).toEqual(['java', 'docker', 'git']);
    photo.dispatchEvent(new Event('error'));
    await TestBed.inject(ApplicationRef).whenStable();
    expect(page.querySelector('.hero__initials')!.textContent!.trim()).toBe('CL');
  });

  it('should render only featured projects with service data, logos and context badges', async () => {
    const team = {
      ...featuredProject,
      id: 'team',
      name: 'Team',
      context: 'collaboration' as const,
      logoUrl: '/team.png',
    };
    const page = await setup({ projects$: of([featuredProject, team, otherProject]) });
    const projects = page.querySelectorAll('.bento__project');
    expect(projects).toHaveLength(2);
    expect(projects[0].classList).toContain('bento__tile--lead');
    expect(projects[0].textContent).toContain('WIMO');
    expect(projects[0].textContent).toContain('Transfert d’argent.');
    expect(projects[0].textContent).toContain('B-HER EMPIRE');
    expect(projects[0].querySelector('a')!.getAttribute('href')).toBe('/projets');
    expect(projects[1].querySelector('img')!.getAttribute('src')).toBe('/team.png');
    expect(projects[1].textContent).toContain('Projet en équipe');
    expect(page.querySelector('.bento')!.textContent).not.toContain('Other');
  });

  it('should compute the tools count and display availability and company data in tiles', async () => {
    const profile = {
      ...PROFILE_FIXTURE,
      company: { ...PROFILE_FIXTURE.company, name: 'Example Company' },
    };
    const page = await setup({ profile });
    expect(
      page.querySelector('.bento__tile--tools .bento__count')!.getAttribute('data-value'),
    ).toBe('03');
    expect(
      page.querySelector('.bento__tile--availability app-availability-badge')!.textContent,
    ).toContain('Disponible à distance');
    expect(page.querySelector('.bento__tile--founder')!.textContent).toContain('Example Company');
    expect(page.querySelector('.hero__eyebrow')!.textContent).toContain('Example Company');
  });

  it('should preserve loading and empty project states', async () => {
    const page = await setup({ projects$: NEVER });
    expect(page.querySelector('.home-work')!.textContent).toContain('Chargement des projets');
  });

  it('should keep the supporting tiles when there are no featured projects', async () => {
    const page = await setup({ projects$: of([otherProject]) });
    expect(page.textContent).toContain('Aucun projet mis en avant pour le moment.');
    expect(page.querySelectorAll('.bento__project')).toHaveLength(0);
    expect(page.querySelectorAll('.bento > article')).toHaveLength(3);
  });

  it('should hide the CV link when the current language has no available PDF', async () => {
    const page = await setup({ cvPdf: { fr: '', en: '/cv/cv-en.pdf' } });
    expect(page.querySelector('.hero__cv')).toBeNull();
  });

  it('should update the manifesto and hide the previous CV while checking a new language', async () => {
    const englishPdf = new Subject<string>();
    const page = await setup({
      cvPdf: { fr: '/cv/cv-fr.pdf', en: '' },
      cvPdf$: { en: englishPdf },
    });
    expect(page.querySelector('.hero__cv')!.getAttribute('href')).toBe('/cv/cv-fr.pdf');

    TestBed.inject(LanguageService).lang.set('en');
    await TestBed.inject(ApplicationRef).whenStable();

    expect(page.querySelector('.hero__cv')).toBeNull();
    expect(page.querySelector('.manifesto__text')!.getAttribute('aria-label')).toBe(
      "I never say “I can't”. I dare, and I dream big.",
    );
    expect(page.querySelector('.manifesto__text')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
      "I never say “I can't”. I dare, and I dream big.",
    );
    expect(page.querySelector('h1')!.textContent).toContain('Slogan in English.');

    englishPdf.next('/cv/cv-en.pdf');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(page.querySelector('.hero__cv')!.getAttribute('href')).toBe('/cv/cv-en.pdf');
  });

  it.each(['fr', 'en'] as const)(
    'should link directly to the available %s PDF as a text link',
    async (lang) => {
      const page = await setup({ lang, cvPdf: { fr: '/cv/cv-fr.pdf', en: '/cv/cv-en.pdf' } });
      const cv = page.querySelector('.hero__cv')!;
      expect(cv.getAttribute('href')).toBe(`/cv/cv-${lang}.pdf`);
      expect(cv.hasAttribute('download')).toBe(true);
      expect(cv.classList).not.toContain('button');
      expect(cv.textContent).toContain(lang === 'fr' ? 'Télécharger le CV' : 'Download the CV');
    },
  );
});
