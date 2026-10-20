import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../testing/transloco-testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { NAV_ITEMS } from '../navigation';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, provideTranslocoForTests()],
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

  it('should display the menu inside a glass pill', () => {
    expect(compiled.querySelector('.header__pill.glass')).not.toBeNull();
  });

  it('should keep accessible names on the language and theme buttons', () => {
    const buttons = compiled.querySelectorAll('.header__icon-button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute('aria-label')?.trim()).toBeTruthy();
    expect(buttons[1].getAttribute('aria-label')?.trim()).toBeTruthy();
  });

  it('should link to the six pages in menu order', () => {
    const hrefs = Array.from(compiled.querySelectorAll('.header__nav a')).map((a) =>
      a.getAttribute('href'),
    );

    expect(hrefs).toEqual(['/', '/projets', '/outils', '/a-propos', '/cv', '/contact']);
  });
});
