import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../../testing/profile.fixture';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ContactConfigService } from '../../../../shared/contact-config/data-access/contact-config.service';
import {
  ContactConfig,
  EMPTY_CONTACT_CONFIG,
} from '../../../../shared/contact-config/models/contact-config.model';
import { CONTACT_MESSAGE_SENDER } from '../../../../shared/contact-message/models/contact-message.model';
import { ProfileService } from '../../../../shared/profile/data-access/profile.service';
import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;
  let compiled: HTMLElement;
  let contactConfig$: BehaviorSubject<ContactConfig>;

  function mockClipboard(clipboard: { writeText: (text: string) => Promise<void> } | undefined) {
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });
  }

  async function clickCopy(): Promise<void> {
    compiled.querySelector<HTMLButtonElement>('.contact__actions button')!.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    contactConfig$ = new BehaviorSubject<ContactConfig>(EMPTY_CONTACT_CONFIG);
    TestBed.configureTestingModule({
      imports: [ContactPage, provideTranslocoForTests()],
      providers: [
        { provide: ToolService, useValue: { getPublicTools: () => of([]) } },
        { provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } },
        { provide: ContactConfigService, useValue: { getContactConfig: () => contactConfig$ } },
        { provide: CONTACT_MESSAGE_SENDER, useValue: { send: () => of('sent') } },
      ],
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

  it('should not show the message form without a Web3Forms key', () => {
    expect(compiled.querySelector('form')).toBeNull();
    expect(compiled.querySelector('.contact__email')).not.toBeNull();
  });

  it('should show the message form right under the email once a key is configured', async () => {
    contactConfig$.next({
      ...EMPTY_CONTACT_CONFIG,
      whatsapp: '237600000000',
      web3formsAccessKey: '0a1b2c3d-4e5f-6789-abcd-ef0123456789',
    });
    await fixture.whenStable();

    const column = Array.from(compiled.querySelector('.contact__direct')!.children).map(
      (child) =>
        child.tagName.toLowerCase() + (child.className ? '.' + child.className.split(' ')[0] : ''),
    );
    expect(column).toEqual([
      'section.contact__email',
      'app-contact-form.reveal',
      'section.contact__whatsapp',
    ]);
    expect(compiled.querySelector('form')).not.toBeNull();
  });

  it('should hide the WhatsApp block when there is no contact configuration', () => {
    expect(compiled.querySelector('.contact__whatsapp')).toBeNull();
  });

  it('should show the WhatsApp button, but never any phone number, once configured', async () => {
    contactConfig$.next({
      ...EMPTY_CONTACT_CONFIG,
      whatsapp: '237600000000',
      phones: [{ number: '+237 600 00 00 00', label: { fr: 'Appels', en: 'Calls' } }],
    });
    await fixture.whenStable();

    const button = compiled.querySelector('.contact__whatsapp app-whatsapp-button a')!;
    expect(button.getAttribute('href')).toBe('https://wa.me/237600000000');
    expect(compiled.textContent).not.toContain('+237');
    expect(compiled.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
