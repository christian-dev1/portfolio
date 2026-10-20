import { OrbitLayout, orbitLogoCount, orbitTracks } from './orbit-path';

/** Bande à y = 100, anneau de rayon 50 centré dessus, au milieu d'une zone de 1000 px. */
const LAYOUT: OrbitLayout = {
  width: 1000,
  bandY: 100,
  centerX: 500,
  centerY: 100,
  radius: 50,
  logoSize: 20,
};

describe('orbitTracks', () => {
  it('should run the left stream from outside the left edge along the band, then over the ring', () => {
    // Act
    const { left } = orbitTracks(LAYOUT);

    // Assert
    expect(left.path).toBe('M -20 100 L 450 100 A 50 50 0 0 1 550 100');
  });

  it('should run the right stream from outside the right edge along the band, then under the ring', () => {
    const { right } = orbitTracks(LAYOUT);

    expect(right.path).toBe('M 1020 100 L 550 100 A 50 50 0 0 1 450 100');
  });

  it('should measure each track as its straight part plus half the circle', () => {
    const { left, right } = orbitTracks(LAYOUT);

    const halfCircle = Math.PI * 50;
    expect(left.length).toBeCloseTo(470 + halfCircle, 0);
    expect(right.length).toBeCloseTo(470 + halfCircle, 0);
  });

  it('should fade each stream out on the far side of the ring, counted from its own edge', () => {
    const { left, right } = orbitTracks(LAYOUT);

    expect(left).toMatchObject({ fadeFrom: 500, fadeTo: 540 });
    expect(right).toMatchObject({ fadeFrom: 500, fadeTo: 540 });
  });

  it('should follow the real positions when the ring is off-centre', () => {
    const { left, right } = orbitTracks({ ...LAYOUT, width: 800, centerX: 300 });

    expect(left.path).toBe('M -20 100 L 250 100 A 50 50 0 0 1 350 100');
    expect(right.path).toBe('M 820 100 L 350 100 A 50 50 0 0 1 250 100');
    expect(right.fadeFrom).toBe(500);
  });

  it('should take the long way over the ring when the band is below its centre', () => {
    // Bande 30 px sous le centre : corde de demi-longueur 40 (triangle 30-40-50).
    const { left, right } = orbitTracks({ ...LAYOUT, centerY: 70 });

    expect(left.path).toBe('M -20 100 L 460 100 A 50 50 0 1 1 540 100');
    expect(right.path).toBe('M 1020 100 L 540 100 A 50 50 0 0 1 460 100');
    expect(left.length).toBeGreaterThan(right.length);
  });
});

describe('orbitLogoCount', () => {
  it('should show fewer logos on small screens', () => {
    expect(orbitLogoCount(360)).toBe(3);
    expect(orbitLogoCount(768)).toBe(5);
    expect(orbitLogoCount(1440)).toBe(7);
  });
});
