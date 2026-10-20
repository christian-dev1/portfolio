import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { LanguageService } from '../../../../core/i18n/language.service';
import { CareerService } from '../../../../shared/career/data-access/career.service';
import { ContactConfigService } from '../../../../shared/contact-config/data-access/contact-config.service';
import {
  ContactConfig,
  EMPTY_CONTACT_CONFIG,
} from '../../../../shared/contact-config/models/contact-config.model';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { Profile } from '../../../../shared/profile/models/profile.model';
import { ProjectService } from '../../../../shared/projects/data-access/project.service';
import { Project } from '../../../../shared/projects/models/project.model';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { Tool } from '../../../../shared/tools/models/tool.model';
import { CvPdfService } from '../../../../shared/contact-config/data-access/cv-pdf.service';
import { PAGE_LOCATION, PageLocation } from '../../data-access/complete-cv';
import { CvPage, shortUrl } from './cv-page';

const PROJECT: Project = {
  id: 'wimo',
  name: 'WIMO',
  summary: { fr: 'Transfert d’argent.', en: 'Money transfer.' },
  highlights: [{ fr: 'Point fort', en: 'Highlight' }],
  coverTagline: { fr: 'Accroche', en: 'Tagline' },
  context: 'b-her',
  roles: ['Backend'],
  technologies: ['Spring Boot'],
  status: 'in-progress',
  visible: true,
  featured: true,
};

function tool(id: string, category: Tool['category']): Tool {
  return { id, name: { fr: id, en: id }, category, usedIn: [], visible: true };
}

const CONTACT_CONFIG: ContactConfig = {
  ...EMPTY_CONTACT_CONFIG,
  whatsapp: '237600000000',
  phones: [{ number: '+237 600 00 00 00', label: { fr: 'Appels', en: 'Calls' } }],
};

const PUBLIC_LOCATION: PageLocation = { hostname: 'localhost', search: '' };

async function setup(
  profile: Profile = PROFILE_FIXTURE,
  contactConfig: ContactConfig = EMPTY_CONTACT_CONFIG,
  location: PageLocation = PUBLIC_LOCATION,
): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [CvPage, provideTranslocoForTests()],
    providers: [
      provideRouter([]),
      { provide: ProfileService, useValue: { getProfile: () => of(profile) } },
      { provide: ProjectService, useValue: { getPublicProjects: () => of([PROJECT]) } },
      { provide: CareerService, useValue: { getCareer: () => of([]) } },
      { provide: ContactConfigService, useValue: { getContactConfig: () => of(contactConfig) } },
      { provide: CvPdfService, useValue: { getAvailableUrl: () => of('') } },
      { provide: PAGE_LOCATION, useValue: location },
      {
        provide: ToolService,
        useValue: {
          getPublicTools: () =>
            of([
              tool('Java', 'languages'),
              tool('Docker', 'environment'),
              tool('Git', 'environment'),
            ]),
        },
      },
    ],
  });

  TestBed.inject(LanguageService).lang.set('fr');
  const fixture = TestBed.createComponent(CvPage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('CvPage', () => {
  it('should have a single h1, in the page banner', async () => {
    const compiled = await setup();

    expect(compiled.querySelectorAll('h1').length).toBe(1);
  });

  it('should display the name, the job title, the city and the contact links', async () => {
    const compiled = await setup({
      ...PROFILE_FIXTURE,
      socialLinks: [
        { network: 'linkedin', url: 'https://www.linkedin.com/in/example' },
        ...PROFILE_FIXTURE.socialLinks,
      ],
    });

    const header = compiled.querySelector('.cv__header')!;
    expect(header.textContent).toContain('Noutchom Noumbiap Christian Luther');
    expect(header.textContent).toContain('Développeur Backend & QA');
    expect(header.textContent).toContain('Ville');
    expect(header.textContent).not.toContain('Pays');
    const hrefs = Array.from(header.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      'mailto:contact@example.com',
      'https://www.linkedin.com/in/example',
      'https://github.com/example',
      'https://portfolio.example.com/',
    ]);
  });

  it('should use the first bio paragraph as the profile summary', async () => {
    const compiled = await setup();

    const profile = compiled.querySelector('[aria-labelledby="cv-profile-title"]')!.textContent!;
    expect(profile).toContain('Premier paragraphe.');
    expect(profile).not.toContain('Second paragraphe.');
  });

  it('should list the projects with their highlights', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('app-cv-projects')!.textContent).toContain('Point fort');
  });

  it('should list the skills by category and link to the toolbox', async () => {
    const compiled = await setup();

    const skills = Array.from(compiled.querySelectorAll('.cv__skills dd')).map((dd) =>
      dd.textContent!.replace(/\s+/g, ' ').trim(),
    );
    expect(skills).toEqual(['Java', 'Docker, Git']);
    expect(compiled.querySelector('.cv__more')!.getAttribute('href')).toBe('/outils');
  });

  it('should display qualities, languages and interests', async () => {
    const compiled = await setup();

    const side = compiled.querySelector('.cv__side')!.textContent!;
    expect(side).toContain('Travail en équipe');
    expect(side).toContain('Français — Courant');
    expect(side).toContain('Football');
  });

  it('should hide the direct contact block when there is no contact configuration', async () => {
    const compiled = await setup();

    expect(compiled.querySelector('.cv__direct')).toBeNull();
    expect(compiled.querySelector('app-whatsapp-button')).toBeNull();
  });

  it('should show the WhatsApp button, but never any phone number, on the public CV', async () => {
    const compiled = await setup(PROFILE_FIXTURE, CONTACT_CONFIG);

    const direct = compiled.querySelector('.cv__direct')!;
    expect(direct.querySelector('app-whatsapp-button a')!.getAttribute('href')).toBe(
      'https://wa.me/237600000000',
    );
    expect(direct.classList).not.toContain('cv__direct--complete');
    expect(compiled.textContent).not.toContain('+237');
    expect(compiled.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it('should ignore ?complet=1 outside localhost, as in production', async () => {
    const compiled = await setup(PROFILE_FIXTURE, CONTACT_CONFIG, {
      hostname: 'luchrist.example.com',
      search: '?complet=1',
    });

    expect(compiled.textContent).not.toContain('+237');
    expect(compiled.querySelector('.cv__phones')).toBeNull();
  });

  it('should add the WhatsApp and phone numbers on localhost with ?complet=1', async () => {
    const compiled = await setup(PROFILE_FIXTURE, CONTACT_CONFIG, {
      hostname: 'localhost',
      search: '?complet=1',
    });

    const direct = compiled.querySelector('.cv__direct')!;
    expect(direct.classList).toContain('cv__direct--complete');
    const phones = Array.from(direct.querySelectorAll('.cv__phones li')).map((li) =>
      li.textContent!.replace(/\s+/g, ' ').trim(),
    );
    expect(phones).toEqual(['WhatsApp pro +237600000000', 'Appels +237 600 00 00 00']);
    expect(direct.querySelectorAll('a[href^="tel:"]')[1].getAttribute('href')).toBe(
      'tel:+237600000000',
    );
  });

  it('should list the phone numbers in complete mode even without WhatsApp', async () => {
    const compiled = await setup(
      PROFILE_FIXTURE,
      { ...CONTACT_CONFIG, whatsapp: '' },
      { hostname: '127.0.0.1', search: '?complet=1' },
    );

    expect(compiled.querySelector('app-whatsapp-button')).toBeNull();
    expect(compiled.querySelector('.cv__phones')!.textContent).toContain('+237 600 00 00 00');
  });

  it('should hide the direct contact block on the public CV when there is no WhatsApp', async () => {
    const compiled = await setup(PROFILE_FIXTURE, { ...CONTACT_CONFIG, whatsapp: '' });

    expect(compiled.querySelector('.cv__direct')).toBeNull();
  });

  describe('print', () => {
    it('should print the city only and short, readable links', async () => {
      const compiled = await setup({
        ...PROFILE_FIXTURE,
        socialLinks: [
          { network: 'linkedin', url: 'https://www.linkedin.com/in/example/' },
          ...PROFILE_FIXTURE.socialLinks,
        ],
      });

      const printed = Array.from(compiled.querySelectorAll('.cv__header .cv__print-only')).map(
        (element) => element.textContent!.trim(),
      );
      expect(printed).toEqual([
        '',
        'linkedin.com/in/example',
        'github.com/example',
        'portfolio.example.com',
      ]);
      expect(compiled.querySelector('.cv__photo')!.getAttribute('src')).toBe(
        '/images/photo-test.jpg',
      );
    });

    it('should shorten addresses without losing their path', () => {
      expect(shortUrl('https://www.linkedin.com/in/christian-noutchom-494840345/')).toBe(
        'linkedin.com/in/christian-noutchom-494840345',
      );
      expect(shortUrl('https://github.com/christian-dev1')).toBe('github.com/christian-dev1');
    });

    it('should name the document for the PDF while printing, then restore the title', async () => {
      await setup();
      const title = TestBed.inject(Title);
      title.setTitle('LUCHRIST — CV');

      window.dispatchEvent(new Event('beforeprint'));
      expect(title.getTitle()).toBe('CV — Christian Luther Noutchom Noumbiap');

      window.dispatchEvent(new Event('afterprint'));
      expect(title.getTitle()).toBe('LUCHRIST — CV');
    });

    it('should use the English document title in English', async () => {
      await setup();
      const title = TestBed.inject(Title);
      TestBed.inject(LanguageService).lang.set('en');
      await TestBed.inject(ApplicationRef).whenStable();

      window.dispatchEvent(new Event('beforeprint'));

      expect(title.getTitle()).toBe('Resume — Christian Luther Noutchom Noumbiap');
      window.dispatchEvent(new Event('afterprint'));
    });
  });
});
