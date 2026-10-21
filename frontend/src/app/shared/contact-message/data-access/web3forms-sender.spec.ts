import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { ContactConfigService } from '../../contact-config/data-access/contact-config.service';
import { EMPTY_CONTACT_CONFIG } from '../../contact-config/models/contact-config.model';
import { ContactMessage } from '../models/contact-message.model';
import { WEB3FORMS_URL, Web3FormsSender } from './web3forms-sender';

const KEY = '0a1b2c3d-4e5f-6789-abcd-ef0123456789';
const MESSAGE: ContactMessage = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Bonjour, parlons de votre projet.',
};

describe('Web3FormsSender', () => {
  let sender: Web3FormsSender;
  let httpTesting: HttpTestingController;

  function setup(accessKey: string): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Web3FormsSender,
        {
          provide: ContactConfigService,
          useValue: {
            getContactConfig: () => of({ ...EMPTY_CONTACT_CONFIG, web3formsAccessKey: accessKey }),
          },
        },
      ],
    });
    sender = TestBed.inject(Web3FormsSender);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpTesting.verify();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should post the message as JSON with the access key, subject and empty botcheck', async () => {
    setup(KEY);

    const result = firstValueFrom(sender.send(MESSAGE));
    const request = httpTesting.expectOne(WEB3FORMS_URL);
    request.flush({ success: true, message: 'Email sent successfully!' });

    expect(request.request.method).toBe('POST');
    expect(request.request.url).toBe('https://api.web3forms.com/submit');
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.get('Content-Type')).toBe('application/json');
    expect(request.request.body).toEqual({
      access_key: KEY,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Bonjour, parlons de votre projet.',
      subject: 'Nouveau message — Portfolio LUCHRIST',
      botcheck: false,
    });
    expect(await result).toBe('sent');
  });

  it('should reject HTTP 200 when success is false', async () => {
    setup(KEY);

    const result = firstValueFrom(sender.send(MESSAGE));
    httpTesting
      .expectOne(WEB3FORMS_URL)
      .flush({ success: false, message: 'Invalid access key' }, { status: 200, statusText: 'OK' });

    expect(await result).toBe('failed');
  });

  it('should report a failure, without throwing, on an HTTP or network error', async () => {
    setup(KEY);

    const rejected = firstValueFrom(sender.send(MESSAGE));
    httpTesting
      .expectOne(WEB3FORMS_URL)
      .flush({ success: false }, { status: 400, statusText: 'Bad Request' });
    expect(await rejected).toBe('failed');

    const offline = firstValueFrom(sender.send(MESSAGE));
    httpTesting.expectOne(WEB3FORMS_URL).error(new ProgressEvent('error'));
    expect(await offline).toBe('failed');
  });

  it.each([{}, { success: 'true' }, { success: 1 }, null])(
    'should reject a malformed success response: %j',
    async (response) => {
      setup(KEY);
      const result = firstValueFrom(sender.send(MESSAGE));

      httpTesting.expectOne(WEB3FORMS_URL).flush(response);

      expect(await result).toBe('failed');
    },
  );

  it.each([true, false])(
    'should warn for a missing key only in development: %s',
    async (development) => {
      setup('');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.stubGlobal('ngDevMode', development);

      const result = await firstValueFrom(sender.send(MESSAGE));

      expect(result).toBe('failed');
      httpTesting.expectNone(WEB3FORMS_URL);
      if (development) {
        expect(warn).toHaveBeenCalledWith(
          'Contact submission skipped: Web3Forms access key is missing.',
        );
      } else {
        expect(warn).not.toHaveBeenCalled();
      }
    },
  );

  it('should not call the service at all without an access key', async () => {
    setup('');

    expect(await firstValueFrom(sender.send(MESSAGE))).toBe('failed');
    httpTesting.expectNone(WEB3FORMS_URL);
  });
});
