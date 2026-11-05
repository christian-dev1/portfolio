import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';
import { ApiContactSender } from './api-contact-sender';

const MESSAGE: ContactMessage = {
  name: 'Example Visitor',
  email: 'visitor@example.com',
  message: 'Bonjour, parlons de votre projet.',
};

describe('ApiContactSender', () => {
  let sender: ApiContactSender;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiContactSender],
    });
    sender = TestBed.inject(ApiContactSender);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should post the message with an unchecked honeypot and accept HTTP 202', async () => {
    const result = firstValueFrom(sender.send(MESSAGE));
    const request = httpTesting.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ ...MESSAGE, botcheck: false });
    request.flush(null, { status: 202, statusText: 'Accepted' });
    expect(await result).toBe('sent');
  });

  it('should report HTTP 429 without throwing', async () => {
    const result = firstValueFrom(sender.send(MESSAGE));
    httpTesting.expectOne('/api/contact').flush(
      { status: 429, detail: 'Contact rate limit exceeded' },
      { status: 429, statusText: 'Too Many Requests', headers: { 'Retry-After': '3600' } },
    );
    expect(await result).toBe('rate-limited');
  });

  it.each([400, 500])('should report HTTP %s as failed without throwing', async (status) => {
    const result = firstValueFrom(sender.send(MESSAGE));
    httpTesting.expectOne('/api/contact').flush(
      { status },
      { status, statusText: status === 400 ? 'Bad Request' : 'Internal Server Error' },
    );
    expect(await result).toBe('failed');
  });

  it('should report a network error as failed without throwing', async () => {
    const result = firstValueFrom(sender.send(MESSAGE));
    httpTesting.expectOne('/api/contact').error(new ProgressEvent('error'));
    expect(await result).toBe('failed');
  });
});
