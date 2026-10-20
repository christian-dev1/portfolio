import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Tool } from '../models/tool.model';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/tools.json';

  // Lu par plusieurs pages (accueil, liste, CV) : une seule requête, partagée.
  private readonly tools$ = this.http.get<Tool[]>(this.url).pipe(shareReplay(1));

  getPublicTools(): Observable<Tool[]> {
    return this.tools$.pipe(map((tools) => tools.filter((tool) => tool.visible)));
  }
}
