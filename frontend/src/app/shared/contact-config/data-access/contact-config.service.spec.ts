import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { EMPTY_CONTACT_CONFIG } from '../models/contact-config.model';
import { ContactConfigService } from './contact-config.service';

const VALID = {
  whatsapp: '237600000000',
  phones: [{ number: '+237 600 00 00 00', label: { fr: 'Appels', en: 'Calls' } }],
};

describe('ContactConfigService', () => {
  let service: ContactConfigService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactConfigService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load the contact configuration when the file exists', async () => {
    const result = firstValueFrom(service.getContactConfig());

    const request = httpTesting.expectOne('/config/contact.json');
    expect(request.request.method).toBe('GET');
    request.flush(VALID);

    expect(await result).toEqual(VALID);
  });

  it('should return an empty configuration, without error, when the file is missing', async () => {
    const result = firstValueFrom(service.getContactConfig());

    httpTesting
      .expectOne('/config/contact.json')
      .flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(await result).toEqual(EMPTY_CONTACT_CONFIG);
  });

  it('should return an empty configuration when the file is not valid JSON', async () => {
    const result = firstValueFrom(service.getContactConfig());

    httpTesting.expectOne('/config/contact.json').error(new ProgressEvent('error'));

    expect(await result).toEqual(EMPTY_CONTACT_CONFIG);
  });

  it('should drop invalid values and keep the valid ones', async () => {
    const result = firstValueFrom(service.getContactConfig());

    httpTesting.expectOne('/config/contact.json').flush({
      whatsapp: '+237 6 00',
      phones: [
        VALID.phones[0],
        { number: '600000000', label: { fr: 'Sans indicatif', en: 'No country code' } },
        { number: '+237 600 00 00 01', label: { fr: 'Sans anglais' } },
      ],
    });

    expect(await result).toEqual({ whatsapp: '', phones: VALID.phones });
  });

  it('should request the file only once', async () => {
    const first = firstValueFrom(service.getContactConfig());
    httpTesting.expectOne('/config/contact.json').flush(VALID);
    await first;

    await firstValueFrom(service.getContactConfig());

    httpTesting.expectNone('/config/contact.json');
  });
});
