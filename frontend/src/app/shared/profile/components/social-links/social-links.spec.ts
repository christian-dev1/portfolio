import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  let fixture: ComponentFixture<SocialLinks>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinks, provideTranslocoForTests()],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('profile', PROFILE_FIXTURE);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should link to GitLab, GitHub and the email address', () => {
    const hrefs = Array.from(compiled.querySelectorAll('a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(hrefs).toEqual([
      'https://gitlab.com/example',
      'https://github.com/example',
      'mailto:contact@example.com',
    ]);
  });

  it('should open external links safely in a new tab', () => {
    const externalLinks = compiled.querySelectorAll('a[target="_blank"]');

    expect(externalLinks.length).toBe(2);
    externalLinks.forEach((link) => expect(link.getAttribute('rel')).toContain('noopener'));
  });

  it('should give every icon link an accessible name', () => {
    compiled.querySelectorAll('a').forEach((link) => {
      expect(link.getAttribute('aria-label')?.trim()).toBeTruthy();
    });
  });
});
