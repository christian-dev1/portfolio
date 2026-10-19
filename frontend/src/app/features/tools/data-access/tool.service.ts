import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Tool } from '../models/tool.model';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/tools.json';

  getPublicTools(): Observable<Tool[]> {
    return this.http
      .get<Tool[]>(this.url)
      .pipe(map((tools) => tools.filter((tool) => tool.visible)));
  }
}
