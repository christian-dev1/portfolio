import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/projects.json';

  getPublicProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.url)
      .pipe(map((projects) => projects.filter((project) => project.visible)));
  }
}
