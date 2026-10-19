import { BRAND_ICONS, contrastRatio, isBrandIconSlug } from './brand-icons';

describe('brand icons', () => {
  it('should compute the WCAG contrast ratio between two colors', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it('should keep the official color when it is readable on the dark theme', () => {
    expect(BRAND_ICONS.docker.color).toBe('#2496ED');
  });

  it('should fall back to currentColor for logos too dark for the dark theme', () => {
    expect(BRAND_ICONS.openjdk.color).toBeNull();
    expect(BRAND_ICONS.intellijidea.color).toBeNull();
    expect(BRAND_ICONS.github.color).toBeNull();
  });

  it('should use the Angular red instead of the default black', () => {
    expect(BRAND_ICONS.angular.hex).toBe('#DD0031');
    expect(BRAND_ICONS.angular.color).toBe('#DD0031');
  });

  it('should pick a dark ink on light brand colors and a light ink on dark ones', () => {
    expect(BRAND_ICONS.gitlab.inkOnHex).toBe('dark');
    expect(BRAND_ICONS.github.inkOnHex).toBe('light');
  });

  it('should recognise known slugs only', () => {
    expect(isBrandIconSlug('docker')).toBe(true);
    expect(isBrandIconSlug('toString')).toBe(false);
    expect(isBrandIconSlug('unknown')).toBe(false);
  });
});
