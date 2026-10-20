import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CareerEntry } from '../models/career.model';
import { CareerService } from './career.service';

function entry(id: string, endYear: number, startYear?: number, visible = true): CareerEntry {
  return {
    id,
    type: 'education',
    startYear,
    endYear,
    title: { fr: id, en: id },
    place: 'Place',
    visible,
  };
}

describe('CareerService', () => {
  let service: CareerService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CareerService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request the career with a GET', async () => {
    const result = firstValueFrom(service.getCareer());

    const request = httpTesting.expectOne('/data/career.json');
    expect(request.request.method).toBe('GET');
    request.flush([]);

    await result;
  });

  it('should return only visible entries, most recent first', async () => {
    const result = firstValueFrom(service.getCareer());

    httpTesting
      .expectOne('/data/career.json')
      .flush([entry('old', 2018), entry('hidden', 2025, 2024, false), entry('recent', 2026, 2024)]);

    expect((await result).map((e) => e.id)).toEqual(['recent', 'old']);
  });

  it('should put the most recently started entry first when two end the same year', async () => {
    const result = firstValueFrom(service.getCareer());

    httpTesting
      .expectOne('/data/career.json')
      .flush([entry('job', 2023, 2022), entry('diploma', 2023)]);

    expect((await result).map((e) => e.id)).toEqual(['diploma', 'job']);
  });

  it('should request the career only once when several pages read it', async () => {
    const first = firstValueFrom(service.getCareer());
    httpTesting.expectOne('/data/career.json').flush([]);
    await first;

    await firstValueFrom(service.getCareer());

    httpTesting.expectNone('/data/career.json');
  });
});
