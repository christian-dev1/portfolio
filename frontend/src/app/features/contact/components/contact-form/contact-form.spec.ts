import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import {
  CONTACT_MESSAGE_SENDER,
  ContactMessage,
  SendResult,
} from '../../../../shared/contact-message/models/contact-message.model';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let compiled: HTMLElement;
  let send: ReturnType<typeof vi.fn<(message: ContactMessage) => Subject<SendResult>>>;
  let pending: Subject<SendResult>;

  beforeEach(async () => {
    pending = new Subject<SendResult>();
    send = vi.fn(() => pending);
    TestBed.configureTestingModule({
      imports: [ContactForm, provideTranslocoForTests()],
      providers: [{ provide: CONTACT_MESSAGE_SENDER, useValue: { send } }],
    });
    TestBed.inject(LanguageService).lang.set('fr');
    fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('email', 'contact@example.com');
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function field(id: 'name' | 'email' | 'message' | 'botcheck'): HTMLInputElement {
    return compiled.querySelector(`#contact-${id}`)!;
  }

  async function type(id: 'name' | 'email' | 'message' | 'botcheck', value: string): Promise<void> {
    const input = field(id);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  async function fillValid(): Promise<void> {
    await type('name', 'Ada Lovelace');
    await type('email', 'ada@example.com');
    await type('message', 'Bonjour, parlons de votre projet.');
  }

  async function submit(): Promise<void> {
    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  function button(): HTMLButtonElement {
    return compiled.querySelector('button[type="submit"]')!;
  }

  function status(): string {
    return compiled.querySelector('[role="status"]')!.textContent!.trim();
  }

  function error(id: string): string | undefined {
    return compiled.querySelector(`#contact-${id}-error`)?.textContent?.trim();
  }

  describe('validation', () => {
    it('should not show any error before the visitor interacts', () => {
      expect(compiled.querySelector('.contact-form__error')).toBeNull();
      expect(field('name').getAttribute('aria-invalid')).toBe('false');
    });

    it('should flag a field once left invalid, and link the error to it', async () => {
      await type('name', 'A');

      expect(error('name')).toBe('Votre nom doit contenir entre 2 et 80 caractères.');
      expect(field('name').getAttribute('aria-invalid')).toBe('true');
      expect(field('name').getAttribute('aria-describedby')).toBe('contact-name-error');
      expect(error('email')).toBeUndefined();
    });

    it('should check the length of the name and the message', async () => {
      await type('name', 'x'.repeat(81));
      await type('message', 'Trop court');
      expect(error('name')).toContain('entre 2 et 80');
      expect(error('message')).toBeUndefined();

      await type('message', 'Court');
      expect(error('message')).toBe('Votre message doit contenir entre 10 et 2000 caractères.');

      await type('message', 'x'.repeat(2001));
      expect(error('message')).toContain('entre 10 et 2000');
    });

    it('should check the email format', async () => {
      await type('email', 'ada@example');
      expect(error('email')).toContain("n'est pas valide");

      await type('email', 'ada@example.com');
      expect(error('email')).toBeUndefined();
    });

    it('should show every required error and send nothing when submitted empty', async () => {
      await submit();

      expect(error('name')).toBe('Indiquez votre nom.');
      expect(error('email')).toBe('Indiquez votre adresse e-mail.');
      expect(error('message')).toBe('Écrivez votre message.');
      expect(document.activeElement).toBe(field('name'));
      expect(send).not.toHaveBeenCalled();
    });

    it('should count the characters of the message', async () => {
      await type('message', 'Bonjour !');

      const counter = compiled.querySelector('#contact-message-counter')!;
      expect(counter.textContent!.trim()).toBe('9 / 2000 caractères');
      expect(field('message').getAttribute('aria-describedby')).toContain(
        'contact-message-counter',
      );
    });
  });

  describe('sending', () => {
    it('should send the trimmed message, disable the button and show « Envoi… »', async () => {
      await fillValid();
      await type('name', '  Ada Lovelace  ');

      await submit();

      expect(send).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'Bonjour, parlons de votre projet.',
      });
      expect(button().disabled).toBe(true);
      expect(button().textContent!.trim()).toBe('Envoi…');
    });

    it('should never send twice while a message is on its way', async () => {
      await fillValid();

      await submit();
      await submit();

      expect(send).toHaveBeenCalledTimes(1);
    });

    it('should thank the visitor and reset the form on success', async () => {
      await fillValid();
      await submit();

      pending.next('sent');
      await fixture.whenStable();

      expect(status()).toBe('Merci, votre message est bien envoyé. Je vous réponds rapidement.');
      expect(field('name').value).toBe('');
      expect(field('message').value).toBe('');
      expect(compiled.querySelector('.contact-form__error')).toBeNull();
      expect(button().disabled).toBe(false);
    });

    it('should keep the fields and offer the email address on failure', async () => {
      await fillValid();
      await submit();

      pending.next('failed');
      await fixture.whenStable();

      expect(status()).toBe(
        "L'envoi a échoué. Réessayez ou écrivez-moi directement à contact@example.com.",
      );
      expect(field('message').value).toBe('Bonjour, parlons de votre projet.');
      expect(button().disabled).toBe(false);
      expect(button().textContent!.trim()).toBe('Envoyer le message');
    });

    it('should let the visitor try again after a failure', async () => {
      await fillValid();
      await submit();
      pending.next('failed');
      await fixture.whenStable();

      await submit();

      expect(send).toHaveBeenCalledTimes(2);
    });

    it('should announce the result in a polite live region', () => {
      const region = compiled.querySelector('[role="status"]')!;

      expect(region.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('honeypot', () => {
    it('should hide the trap field from people, keyboards and screen readers', () => {
      const trap = field('botcheck');

      expect(trap.getAttribute('tabindex')).toBe('-1');
      expect(trap.getAttribute('autocomplete')).toBe('off');
      expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
    });

    it('should send nothing but pretend it worked when the trap is filled', async () => {
      await fillValid();
      await type('botcheck', 'https://spam.example');

      await submit();

      expect(send).not.toHaveBeenCalled();
      expect(status()).toContain('Merci, votre message est bien envoyé.');
      expect(field('name').value).toBe('');
    });
  });
});
