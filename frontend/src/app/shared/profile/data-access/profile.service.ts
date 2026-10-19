import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/profile.json';

  // Le profil est lu par l'accueil et le footer : une seule requête, partagée.
  private readonly profile$ = this.http.get<Profile>(this.url).pipe(shareReplay(1));

  getProfile(): Observable<Profile> {
    return this.profile$;
  }
}
