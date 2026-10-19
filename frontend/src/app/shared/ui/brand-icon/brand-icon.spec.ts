import { TestBed } from '@angular/core/testing';
import { BRAND_ICONS } from '../brand-icons';
import { BrandIcon } from './brand-icon';

describe('BrandIcon', () => {
  it('should render the icon path in a decorative svg', async () => {
    // Arrange
    const fixture = TestBed.createComponent(BrandIcon);
    fixture.componentRef.setInput('icon', BRAND_ICONS.docker);

    // Act
    await fixture.whenStable();

    // Assert
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('path')!.getAttribute('d')).toBe(BRAND_ICONS.docker.path);
  });
});
