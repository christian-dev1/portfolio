import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('should use the saved theme when there is one', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
  });

  it('should ignore an invalid saved value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');

    const service = TestBed.inject(ThemeService);

    expect(['light', 'dark']).toContain(service.theme());
  });

  it('should switch between light and dark', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const service = TestBed.inject(ThemeService);

    service.toggle();

    expect(service.theme()).toBe('dark');
  });

  it('should remember the theme chosen by the visitor', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const service = TestBed.inject(ThemeService);

    service.toggle();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('should apply the theme on the html element', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    TestBed.inject(ThemeService);
    TestBed.tick();

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});