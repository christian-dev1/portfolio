import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { PROFILE_FIXTURE } from '../../../../testing/profile.fixture';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request the profile with a GET', async () => {
    const result = firstValueFrom(service.getProfile());

    const request = httpTesting.expectOne('/data/profile.json');
    expect(request.request.method).toBe('GET');
    request.flush(PROFILE_FIXTURE);

    expect(await result).toEqual(PROFILE_FIXTURE);
  });

  it('should request the profile only once when several components read it', async () => {
    const first = firstValueFrom(service.getProfile());
    httpTesting.expectOne('/data/profile.json').flush(PROFILE_FIXTURE);
    await first;

    const second = await firstValueFrom(service.getProfile());

    httpTesting.expectNone('/data/profile.json');
    expect(second.brand).toBe('LUCHRIST');
  });
});
