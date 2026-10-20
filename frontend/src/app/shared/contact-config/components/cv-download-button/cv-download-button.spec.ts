import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ContactConfigService } from '../../data-access/contact-config.service';
import { ContactConfig, EMPTY_CONTACT_CONFIG } from '../../models/contact-config.model';
import { CvDownloadButton } from './cv-download-button';

const CONFIGURED: ContactConfig = {
  ...EMPTY_CONTACT_CONFIG,
  cvPdf: { fr: '/cv/cv-fr.pdf', en: '/cv/cv-en.pdf' },
};

describe('CvDownloadButton', () => {
  let fixture: ComponentFixture<CvDownloadButton>;
  let httpTesting: HttpTestingController;

  async function setup(config: ContactConfig): Promise<void> {
    TestBed.configureTestingModule({
      imports: [CvDownloadButton, provideTranslocoForTests()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContactConfigService, useValue: { getContactConfig: () => of(config) } },
      ],
    });
    TestBed.inject(LanguageService).lang.set('fr');
    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CvDownloadButton);
    await fixture.whenStable();
  }

  async function answer(url: string, status: number, contentType: string): Promise<void> {
    const request = httpTesting.expectOne(url);
    expect(request.request.method).toBe('HEAD');
    // Le corps éventuel n'est jamais interprété en JSON.
    expect(request.request.responseType).toBe('text');
    request.flush(status === 200 ? '%PDF-1.4' : '', {
      status,
      statusText: String(status),
      headers: { 'Content-Type': contentType },
    });
    await fixture.whenStable();
  }

  function link(): HTMLAnchorElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector('a');
  }

  afterEach(() => {
    httpTesting.verify();
  });

  it('should stay hidden, without any request, when no PDF is configured', async () => {
    await setup(EMPTY_CONTACT_CONFIG);

    httpTesting.expectNone(() => true);
    expect(link()).toBeNull();
  });

  it('should show the download link once the PDF of the active language exists', async () => {
    await setup(CONFIGURED);

    await answer('/cv/cv-fr.pdf', 200, 'application/pdf');

    expect(link()!.getAttribute('href')).toBe('/cv/cv-fr.pdf');
    expect(link()!.hasAttribute('download')).toBe(true);
    expect(link()!.textContent).toContain('Télécharger mon CV');
  });

  it('should stay hidden when the PDF is missing (404)', async () => {
    await setup(CONFIGURED);

    await answer('/cv/cv-fr.pdf', 404, 'text/plain');

    expect(link()).toBeNull();
  });

  it('should stay hidden when the server answers with the HTML page instead of the PDF', async () => {
    await setup(CONFIGURED);

    await answer('/cv/cv-fr.pdf', 200, 'text/html');

    expect(link()).toBeNull();
  });

  it('should stay hidden when HEAD returns a non-200 success status', async () => {
    await setup(CONFIGURED);

    await answer('/cv/cv-fr.pdf', 204, 'application/pdf');

    expect(link()).toBeNull();
  });

  it('should hide the previous language link while its replacement is being checked', async () => {
    await setup(CONFIGURED);
    await answer('/cv/cv-fr.pdf', 200, 'application/pdf');

    TestBed.inject(LanguageService).lang.set('en');
    await fixture.whenStable();

    expect(link()).toBeNull();
    await answer('/cv/cv-en.pdf', 200, 'application/pdf');
    expect(link()!.getAttribute('href')).toBe('/cv/cv-en.pdf');
  });

  it('should stay hidden after a network failure and cache the failed check', async () => {
    await setup(CONFIGURED);
    httpTesting.expectOne('/cv/cv-fr.pdf').error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(link()).toBeNull();

    TestBed.inject(LanguageService).lang.set('en');
    await fixture.whenStable();
    await answer('/cv/cv-en.pdf', 200, 'application/pdf');
    TestBed.inject(LanguageService).lang.set('fr');
    await fixture.whenStable();
    httpTesting.expectNone('/cv/cv-fr.pdf');
    expect(link()).toBeNull();
  });

  it('should follow the active language and check each file only once', async () => {
    await setup(CONFIGURED);
    await answer('/cv/cv-fr.pdf', 200, 'application/pdf');
    const language = TestBed.inject(LanguageService);

    language.lang.set('en');
    await fixture.whenStable();
    await answer('/cv/cv-en.pdf', 404, 'text/plain');
    expect(link()).toBeNull();

    language.lang.set('fr');
    await fixture.whenStable();
    httpTesting.expectNone('/cv/cv-fr.pdf');
    expect(link()!.getAttribute('href')).toBe('/cv/cv-fr.pdf');
  });
});
