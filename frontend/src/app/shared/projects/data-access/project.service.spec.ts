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
      summary: { fr: 'Projet visible', en: 'Visible project' },
      highlights: [],
      coverTagline: { fr: 'Accroche', en: 'Tagline' },
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'in-progress',
      visible: true,
      featured: false,
    },
    {
      id: 'private-project',
      name: 'Private',
      summary: { fr: 'Projet masqué', en: 'Hidden project' },
      highlights: [],
      coverTagline: { fr: 'Accroche', en: 'Tagline' },
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'concept',
      visible: false,
      featured: false,
    },
    {
      id: 'featured-project',
      name: 'Featured',
      summary: { fr: 'Projet mis en avant', en: 'Featured project' },
      highlights: [],
      coverTagline: { fr: 'Accroche', en: 'Tagline' },
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'in-progress',
      visible: true,
      featured: true,
    },
    {
      id: 'hidden-featured-project',
      name: 'Hidden featured',
      summary: { fr: 'Projet masqué mis en avant', en: 'Hidden featured project' },
      highlights: [],
      coverTagline: { fr: 'Accroche', en: 'Tagline' },
      context: 'b-her',
      roles: [],
      technologies: [],
      status: 'concept',
      visible: false,
      featured: true,
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
    expect(visibleProjects.map((project) => project.id)).toEqual([
      'public-project',
      'featured-project',
    ]);
  });

  it('should return only projects that are both visible and featured', async () => {
    const result = firstValueFrom(service.getFeaturedProjects());

    httpTesting.expectOne('/data/projects.json').flush(projects);

    const featuredProjects = await result;
    expect(featuredProjects.map((project) => project.id)).toEqual(['featured-project']);
  });
});
