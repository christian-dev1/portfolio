import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { NAV_ITEMS } from '../navigation';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should display the brand linking to home', () => {
    const brand = compiled.querySelector('.header__brand');

    expect(brand).not.toBeNull();
    expect(brand!.textContent).toContain('LUCHRIST');
    expect(brand!.getAttribute('href')).toBe('/');
  });

  it('should display one link per navigation item', () => {
    const links = compiled.querySelectorAll('.header__nav a');

    expect(links.length).toBe(NAV_ITEMS.length);
  });
});