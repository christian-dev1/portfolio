import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SendResult = 'sent' | 'failed';

/**
 * Envoi d'un message du formulaire de contact. L'implémentation actuelle passe par
 * Web3Forms ; en V2, une implémentation appelant l'API Spring Boot la remplacera.
 */
export interface ContactMessageSender {
  /** N'échoue jamais : une erreur réseau ou un refus du service donne `'failed'`. */
  send(message: ContactMessage): Observable<SendResult>;
}

export const CONTACT_MESSAGE_SENDER = new InjectionToken<ContactMessageSender>(
  'CONTACT_MESSAGE_SENDER',
);
