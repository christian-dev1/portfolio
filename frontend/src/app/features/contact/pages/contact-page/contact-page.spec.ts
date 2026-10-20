import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;
  let compiled: HTMLElement;

  function mockClipboard(clipboard: { writeText: (text: string) => Promise<void> } | undefined) {
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });
  }

  async function clickCopy(): Promise<void> {
    compiled.querySelector<HTMLButtonElement>('.contact__actions button')!.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ContactPage, provideTranslocoForTests()],
      providers: [{ provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } }],
    });

    TestBed.inject(LanguageService).lang.set('fr');
    fixture = TestBed.createComponent(ContactPage);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    mockClipboard(undefined);
    document.getSelection()?.removeAllRanges();
  });

  it('should have a single h1 and count the filled-in networks in the banner', () => {
    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('.page-banner__count')!.textContent).toBe('03');
  });

  it('should display the email address as selectable text with a mailto link', () => {
    expect(compiled.querySelector('.contact__address')!.textContent!.trim()).toBe(
      'contact@example.com',
    );
    expect(compiled.querySelector('.contact__actions a')!.getAttribute('href')).toBe(
      'mailto:contact@example.com',
    );
  });

  it('should display one tile per filled-in network', () => {
    const names = Array.from(compiled.querySelectorAll('.contact__tile strong')).map((strong) =>
      strong.textContent!.trim(),
    );

    expect(names).toEqual(['GitHub', 'GitLab', 'E-mail']);
  });

  it('should keep a space between the network name and its hint', () => {
    const tile = compiled.querySelector('.contact__tile')!.textContent!.replace(/\s+/g, ' ');

    expect(tile.trim()).toBe("GitHub S'ouvre dans un nouvel onglet");
  });

  it('should open external networks safely in a new tab', () => {
    const external = compiled.querySelectorAll('.contact__tile[target="_blank"]');

    expect(external.length).toBe(2);
    external.forEach((tile) => expect(tile.getAttribute('rel')).toBe('noopener noreferrer'));
  });

  it('should copy the email address and confirm it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard({ writeText });

    await clickCopy();

    expect(writeText).toHaveBeenCalledWith('contact@example.com');
    expect(compiled.querySelector('.contact__actions button')!.textContent).toContain('Copié');
    expect(compiled.querySelector('.contact__feedback')!.textContent).toContain(
      'Adresse e-mail copiée',
    );
  });

  it('should select the address and explain what to do when copying is refused', async () => {
    mockClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });

    await clickCopy();

    expect(compiled.querySelector('.contact__feedback')!.textContent).toContain('Ctrl+C');
    expect(document.getSelection()!.toString()).toBe('contact@example.com');
  });

  it('should fall back the same way when the clipboard API does not exist', async () => {
    mockClipboard(undefined);

    await clickCopy();

    expect(compiled.querySelector('.contact__feedback')!.textContent).toContain('Ctrl+C');
  });

  it('should announce the feedback politely to screen readers', () => {
    expect(compiled.querySelector('.contact__feedback')!.getAttribute('aria-live')).toBe('polite');
  });

  it('should not contain any form', () => {
    expect(compiled.querySelector('form')).toBeNull();
  });
});
