import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ToolService } from './tool.service';
import { Tool } from '../models/tool.model';

describe('ToolService', () => {
  let service: ToolService;
  let httpTesting: HttpTestingController;

  const tools: Tool[] = [
    {
      id: 'java',
      name: { fr: 'Java', en: 'Java' },
      category: 'languages',
      usedIn: [{ fr: 'WIMO', en: 'WIMO' }],
      visible: true,
    },
    {
      id: 'hidden-tool',
      name: { fr: 'Outil masqué', en: 'Hidden tool' },
      category: 'testing',
      usedIn: [],
      visible: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ToolService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request the tools with a GET', async () => {
    const result = firstValueFrom(service.getPublicTools());

    const request = httpTesting.expectOne('/data/tools.json');
    expect(request.request.method).toBe('GET');
    request.flush(tools);

    await result;
  });

  it('should return only visible tools', async () => {
    const result = firstValueFrom(service.getPublicTools());

    httpTesting.expectOne('/data/tools.json').flush(tools);

    const visibleTools = await result;
    expect(visibleTools.map((tool) => tool.id)).toEqual(['java']);
  });
});