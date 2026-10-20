import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { CONTACT_MESSAGE_SENDER } from '../../../../shared/contact-message/models/contact-message.model';

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
/** Même règle que le contrat des données : un « @ » et un domaine avec un point. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Champs visibles, dans l'ordre du formulaire (le premier invalide reçoit le focus). */
const FIELDS = ['name', 'email', 'message'] as const;

type FormState = 'idle' | 'sending' | 'sent' | 'failed';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  /** Adresse proposée en repli si l'envoi échoue. */
  readonly email = input.required<string>();

  private readonly sender = inject(CONTACT_MESSAGE_SENDER);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: [
      '',
      [Validators.required, Validators.minLength(NAME_MIN), Validators.maxLength(NAME_MAX)],
    ],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    message: [
      '',
      [Validators.required, Validators.minLength(MESSAGE_MIN), Validators.maxLength(MESSAGE_MAX)],
    ],
    // Champ piège invisible : seul un robot le remplit.
    botcheck: [''],
  });

  protected readonly messageMax = MESSAGE_MAX;
  protected readonly messageLength = toSignal(this.form.controls.message.valueChanges, {
    initialValue: '',
  });
  protected readonly state = signal<FormState>('idle');
  private readonly submitted = signal(false);

  /** Erreur visible seulement après interaction (champ quitté) ou tentative d'envoi. */
  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    if (this.state() === 'sending') {
      return;
    }
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const firstInvalid = FIELDS.find((field) => this.form.controls[field].invalid);
      this.host.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
      return;
    }

    const { name, email, message, botcheck } = this.form.getRawValue();
    if (botcheck) {
      // Robot : rien n'est envoyé, mais il reçoit la même réponse qu'un humain.
      this.succeed();
      return;
    }

    this.state.set('sending');
    this.sender
      .send({ name: name.trim(), email: email.trim(), message: message.trim() })
      .subscribe((result) => {
        if (result === 'sent') {
          this.succeed();
        } else {
          this.state.set('failed');
        }
      });
  }

  private succeed(): void {
    this.form.reset();
    this.submitted.set(false);
    this.state.set('sent');
  }
}
