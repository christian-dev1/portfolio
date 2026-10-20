import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { Lang } from '../../../core/i18n/language.service';
import { ContactConfigService } from './contact-config.service';

@Injectable({ providedIn: 'root' })
export class CvPdfService {
  private readonly http = inject(HttpClient);
  private readonly contactConfig = inject(ContactConfigService);
  /** Une seule requête HEAD par fichier, partagée par l'accueil et /cv. */
  private readonly checks = new Map<string, Observable<boolean>>();

  /**
   * URL du PDF du CV pour la langue, ou chaîne vide si elle n'est pas configurée ou si le
   * fichier n'existe pas (404, ou page HTML renvoyée par le serveur à la place du PDF).
   */
  getAvailableUrl(lang: Lang): Observable<string> {
    return this.contactConfig.getContactConfig().pipe(
      map((config) => config.cvPdf[lang]),
      switchMap((url) => (url ? this.exists(url).pipe(map((ok) => (ok ? url : ''))) : of(''))),
    );
  }

  private exists(url: string): Observable<boolean> {
    let check = this.checks.get(url);
    if (!check) {
      check = this.http.head(url, { observe: 'response', responseType: 'text' }).pipe(
        map(
          (response) =>
            response.status === 200 &&
            response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() ===
              'application/pdf',
        ),
        catchError(() => of(false)),
        shareReplay(1),
      );
      this.checks.set(url, check);
    }
    return check;
  }
}
