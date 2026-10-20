import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import {
  ContactConfig,
  EMPTY_CONTACT_CONFIG,
  toContactConfig,
} from '../models/contact-config.model';

@Injectable({ providedIn: 'root' })
export class ContactConfigService {
  private readonly http = inject(HttpClient);
  private readonly url = '/config/contact.json';

  // Fichier absent (404), illisible ou invalide → configuration vide : les blocs restent masqués.
  private readonly config$ = this.http.get<unknown>(this.url).pipe(
    map(toContactConfig),
    catchError(() => of(EMPTY_CONTACT_CONFIG)),
    shareReplay(1),
  );

  getContactConfig(): Observable<ContactConfig> {
    return this.config$;
  }
}
