import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/projects.json';

  // Lu par plusieurs pages (accueil, liste, CV) : une seule requête, partagée.
  private readonly projects$ = this.http.get<Project[]>(this.url).pipe(shareReplay(1));

  getPublicProjects(): Observable<Project[]> {
    return this.projects$.pipe(map((projects) => projects.filter((project) => project.visible)));
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.getPublicProjects().pipe(
      map((projects) => projects.filter((project) => project.featured)),
    );
  }
}
