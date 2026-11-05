import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ContactMessage, ContactMessageSender, SendResult } from '../models/contact-message.model';

/** Transmet le message à l'API sans propager les erreurs au formulaire. */
@Injectable()
export class ApiContactSender implements ContactMessageSender {
  private readonly http = inject(HttpClient);

  send(message: ContactMessage): Observable<SendResult> {
    return this.http
      .post<void>(
        '/api/contact',
        { name: message.name, email: message.email, message: message.message, botcheck: false },
        { observe: 'response' },
      )
      .pipe(
        map((response): SendResult => (response.status === 202 ? 'sent' : 'failed')),
        catchError((error: unknown) =>
          of<SendResult>(
            error instanceof HttpErrorResponse && error.status === 429 ? 'rate-limited' : 'failed',
          ),
        ),
      );
  }
}
