import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SendResult = 'sent' | 'rate-limited' | 'failed';

/** Envoi d'un message du formulaire de contact. */
export interface ContactMessageSender {
  /** N'échoue jamais : les refus et erreurs sont représentés par un résultat. */
  send(message: ContactMessage): Observable<SendResult>;
}

export const CONTACT_MESSAGE_SENDER = new InjectionToken<ContactMessageSender>(
  'CONTACT_MESSAGE_SENDER',
);
