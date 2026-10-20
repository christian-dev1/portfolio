import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { SocialLink } from '../../models/profile.model';
import { SocialLinks } from './social-links';

const LINKS: SocialLink[] = [
  { network: 'github', url: 'https://github.com/example' },
  { network: 'gitlab', url: 'https://gitlab.com/example' },
  { network: 'linkedin', url: '' },
  { network: 'youtube', url: '   ' },
  { network: 'email', url: 'contact@example.com' },
];

describe('SocialLinks', () => {
  let fixture: ComponentFixture<SocialLinks>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinks, provideTranslocoForTests()],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
    fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', LINKS);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should display the networks in the given order', () => {
    const hrefs = Array.from(compiled.querySelectorAll('a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(hrefs).toEqual([
      'https://github.com/example',
      'https://gitlab.com/example',
      'mailto:contact@example.com',
    ]);
  });

  it('should hide networks whose url is empty', () => {
    expect(compiled.querySelector('a[aria-label^="LinkedIn"]')).toBeNull();
    expect(compiled.querySelector('a[aria-label^="YouTube"]')).toBeNull();
  });

  it('should open external links safely in a new tab', () => {
    const externalLinks = compiled.querySelectorAll('a[target="_blank"]');

    expect(externalLinks.length).toBe(2);
    externalLinks.forEach((link) => expect(link.getAttribute('rel')).toBe('noopener noreferrer'));
  });

  it('should open the email link in the mail client, not in a new tab', () => {
    const email = compiled.querySelector('a[href^="mailto:"]')!;

    expect(email.getAttribute('target')).toBeNull();
    expect(email.getAttribute('aria-label')).toBe('Envoyer un e-mail');
  });

  it('should give every link a translated accessible name', () => {
    const labels = Array.from(compiled.querySelectorAll('a')).map((link) =>
      link.getAttribute('aria-label'),
    );

    expect(labels).toEqual([
      'GitHub (nouvel onglet)',
      'GitLab (nouvel onglet)',
      'Envoyer un e-mail',
    ]);
  });

  it('should render a decorative brand logo in every link', () => {
    compiled.querySelectorAll('a').forEach((link) => {
      expect(link.querySelector('svg[aria-hidden="true"] path')).not.toBeNull();
    });
  });

  it('should expose the official brand color for the hover state', () => {
    const gitlab = compiled.querySelector<HTMLElement>('a[href^="https://gitlab"]')!;

    expect(gitlab.style.getPropertyValue('--brand-hex')).toBe('#FC6D26');
    expect(gitlab.classList).toContain('social-links__link--dark-ink');
  });

  it('should only display the requested networks, in data order', async () => {
    fixture.componentRef.setInput('only', ['email', 'github']);
    await fixture.whenStable();

    const hrefs = Array.from(compiled.querySelectorAll('a')).map((link) =>
      link.getAttribute('href'),
    );
    expect(hrefs).toEqual(['https://github.com/example', 'mailto:contact@example.com']);
  });
});
