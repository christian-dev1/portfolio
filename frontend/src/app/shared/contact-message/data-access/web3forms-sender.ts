import { HttpClient } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { ContactConfigService } from '../../contact-config/data-access/contact-config.service';
import { ContactMessage, ContactMessageSender, SendResult } from '../models/contact-message.model';

export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
export const WEB3FORMS_SUBJECT = 'Nouveau message — Portfolio LUCHRIST';

/** Envoie le message par e-mail via Web3Forms, avec la clé lue dans `/config/contact.json`. */
@Injectable()
export class Web3FormsSender implements ContactMessageSender {
  private readonly http = inject(HttpClient);
  private readonly contactConfig = inject(ContactConfigService);

  send(message: ContactMessage): Observable<SendResult> {
    return this.contactConfig.getContactConfig().pipe(
      take(1),
      switchMap(({ web3formsAccessKey }) => {
        if (!web3formsAccessKey) {
          if (isDevMode()) {
            console.warn('Contact submission skipped: Web3Forms access key is missing.');
          }
          return of<SendResult>('failed');
        }
        return this.http
          .post<{ success?: boolean; message?: string }>(
            WEB3FORMS_URL,
            {
              access_key: web3formsAccessKey,
              name: message.name,
              email: message.email,
              message: message.message,
              subject: WEB3FORMS_SUBJECT,
              botcheck: false,
            },
            { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
          )
          .pipe(
            map((response): SendResult => (response?.success === true ? 'sent' : 'failed')),
            catchError(() => of<SendResult>('failed')),
          );
      }),
    );
  }
}
