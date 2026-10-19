import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../testing/transloco-testing';
import { PROFILE_FIXTURE } from '../../../../testing/profile.fixture';
import { ProfileService } from '../../../shared/profile/data-access/profile.service';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer, provideTranslocoForTests()],
      providers: [{ provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the current year', () => {
    // Arrange
    const currentYear = String(new Date().getFullYear());

    // Assert
    expect(compiled.textContent).toContain(currentYear);
  });

  it('should display the full name and the brand from the profile', () => {
    const copyright = compiled.querySelector('.footer__copyright');

    expect(copyright!.textContent).toContain('Noutchom Noumbiap Christian Luther — LUCHRIST');
  });

  it('should display the social links from the profile', () => {
    const links = compiled.querySelectorAll('app-social-links a');

    expect(links.length).toBe(3);
  });

  it('should hide the decorative diagonal from assistive technologies', () => {
    const edge = compiled.querySelector('.footer__edge');

    expect(edge!.getAttribute('aria-hidden')).toBe('true');
  });
});
