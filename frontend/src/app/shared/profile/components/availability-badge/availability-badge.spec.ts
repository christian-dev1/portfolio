import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Availability } from '../../models/profile.model';
import { AvailabilityBadge } from './availability-badge';

describe('AvailabilityBadge', () => {
  let fixture: ComponentFixture<AvailabilityBadge>;
  let compiled: HTMLElement;

  async function render(availability: Availability, lang: 'fr' | 'en' = 'fr'): Promise<void> {
    TestBed.inject(LanguageService).lang.set(lang);
    fixture = TestBed.createComponent(AvailabilityBadge);
    fixture.componentRef.setInput('availability', availability);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  const remote: Availability = {
    status: 'remote-only',
    label: { fr: 'Disponible à distance', en: 'Available remotely' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityBadge, provideTranslocoForTests()],
    }).compileComponents();
  });

  it('should display the label in the current language', async () => {
    await render(remote, 'en');

    expect(compiled.textContent!.trim()).toBe('Available remotely');
  });

  it('should hide the decorative dot from assistive technologies', async () => {
    await render(remote);

    expect(compiled.querySelector('.availability__dot')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should mark the badge as unavailable only when the status says so', async () => {
    await render(remote);
    expect(compiled.querySelector('.availability--unavailable')).toBeNull();

    fixture.componentRef.setInput('availability', { ...remote, status: 'unavailable' });
    await fixture.whenStable();
    expect(compiled.querySelector('.availability--unavailable')).not.toBeNull();
  });
});
