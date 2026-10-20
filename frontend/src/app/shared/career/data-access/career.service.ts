import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { CareerEntry } from '../models/career.model';

@Injectable({ providedIn: 'root' })
export class CareerService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/career.json';

  // Lu par À propos et le CV : une seule requête, partagée.
  private readonly entries$ = this.http.get<CareerEntry[]>(this.url).pipe(shareReplay(1));

  /** Entrées visibles, de la plus récente à la plus ancienne. */
  getCareer(): Observable<CareerEntry[]> {
    return this.entries$.pipe(
      map((entries) =>
        entries
          .filter((entry) => entry.visible)
          .sort(
            (a, b) =>
              b.endYear - a.endYear || (b.startYear ?? b.endYear) - (a.startYear ?? a.endYear),
          ),
      ),
    );
  }
}
