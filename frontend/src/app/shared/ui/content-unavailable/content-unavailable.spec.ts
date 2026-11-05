import { TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../testing/transloco-testing';
import { LanguageService } from '../../../core/i18n/language.service';
import { ContentUnavailable } from './content-unavailable';
import { ContentRetry } from './loadable';

async function setup(lang: 'fr' | 'en' = 'fr') {
  const retry = vi.fn();
  TestBed.configureTestingModule({
    imports: [ContentUnavailable, provideTranslocoForTests()],
    providers: [{ provide: ContentRetry, useValue: { retry } }],
  });

  TestBed.inject(LanguageService).lang.set(lang);
  const fixture = TestBed.createComponent(ContentUnavailable);
  await fixture.whenStable();
  return { compiled: fixture.nativeElement as HTMLElement, retry };
}

describe('ContentUnavailable', () => {
  it('should announce the message as a status', async () => {
    const { compiled } = await setup();

    const status = compiled.querySelector('[role="status"]')!;
    expect(status.textContent).toContain(
      'Ce contenu est momentanément indisponible. Réessayez dans quelques instants.',
    );
  });

  it('should display the message and the button in English when the language is English', async () => {
    const { compiled } = await setup('en');

    expect(compiled.textContent).toContain(
      'This content is temporarily unavailable. Please try again in a moment.',
    );
    expect(compiled.querySelector('button')!.textContent).toContain('Try again');
  });

  it('should retry the failed loads when the button is clicked', async () => {
    const { compiled, retry } = await setup();

    const button = compiled.querySelector<HTMLButtonElement>('button[type="button"]')!;
    button.click();

    expect(button.textContent).toContain('Réessayer');
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
