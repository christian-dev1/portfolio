import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpTesting: HttpTestingController;

  const projects: Project[] = [
    {
      id: 'public-project',
      name: 'Public',
      summary: 'Projet visible',
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'in-progress',
      visible: true,
    },
    {
      id: 'private-project',
      name: 'Private',
      summary: 'Projet masqué',
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'concept',
      visible: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProjectService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request the projects with a GET', async () => {
    const result = firstValueFrom(service.getPublicProjects());

    const request = httpTesting.expectOne('/data/projects.json');
    expect(request.request.method).toBe('GET');
    request.flush(projects);

    await result;
  });

  it('should return only visible projects', async () => {
    const result = firstValueFrom(service.getPublicProjects());

    httpTesting.expectOne('/data/projects.json').flush(projects);

    const visibleProjects = await result;
    expect(visibleProjects.map((project) => project.id)).toEqual(['public-project']);
  });
});