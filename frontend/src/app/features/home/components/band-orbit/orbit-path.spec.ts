import { FADE_LENGTH_PX, OrbitLayout, orbitTracks } from './orbit-path';

/** Bande à y = 100, anneau de rayon 50 centré dessus, au milieu d'une zone de 1000 px. */
const LAYOUT: OrbitLayout = {
  width: 1000,
  bandY: 100,
  centerX: 500,
  centerY: 100,
  radius: 50,
};

describe('orbitTracks', () => {
  it('should run the left stream from outside the left edge along the band, then over the ring', () => {
    // Act
    const { left } = orbitTracks(LAYOUT);

    // Assert
    expect(left.path).toBe('M 0 100 L 450 100 A 50 50 0 0 1 550 100');
  });

  it('should run the right stream from outside the right edge along the band, then under the ring', () => {
    const { right } = orbitTracks(LAYOUT);

    expect(right.path).toBe('M 1000 100 L 550 100 A 50 50 0 0 1 450 100');
  });

  it('should measure each track as its straight part plus half the circle', () => {
    const { left, right } = orbitTracks(LAYOUT);

    const halfCircle = Math.PI * 50;
    expect(left.length).toBeCloseTo(450 + halfCircle, 0);
    expect(right.length).toBeCloseTo(450 + halfCircle, 0);
  });

  it('should fade over six pixels only', () => {
    expect(FADE_LENGTH_PX).toBe(6);
  });

  it('should fade the upper stream just before the right junction, heading down', () => {
    const { left } = orbitTracks(LAYOUT);

    expect(left.fade).toEqual({ from: { x: 550, y: 94 }, to: { x: 550, y: 100 } });
  });

  it('should fade the lower stream just before the left junction, heading up', () => {
    const { right } = orbitTracks(LAYOUT);

    expect(right.fade).toEqual({ from: { x: 450, y: 106 }, to: { x: 450, y: 100 } });
  });

  it('should keep the fade on the last six pixels of path when the band is off-centre', () => {
    const { left, right } = orbitTracks({ ...LAYOUT, centerY: 70 });

    for (const { fade } of [left, right]) {
      const length = Math.hypot(fade.to.x - fade.from.x, fade.to.y - fade.from.y);
      expect(length).toBeCloseTo(FADE_LENGTH_PX, 1);
    }
    // Triangle 30-40-50 : la tangente horaire en (540, 100) vaut (-0.6, 0.8).
    expect(left.fade.from).toEqual({ x: 543.6, y: 95.2 });
  });

  it('should follow the real positions when the ring is off-centre', () => {
    const { left, right } = orbitTracks({ ...LAYOUT, width: 800, centerX: 300 });

    expect(left.path).toBe('M 0 100 L 250 100 A 50 50 0 0 1 350 100');
    expect(right.path).toBe('M 800 100 L 350 100 A 50 50 0 0 1 250 100');
    expect(right.fade.to).toEqual({ x: 250, y: 100 });
  });

  it('should take the long way over the ring when the band is below its centre', () => {
    // Bande 30 px sous le centre : corde de demi-longueur 40 (triangle 30-40-50).
    const { left, right } = orbitTracks({ ...LAYOUT, centerY: 70 });

    expect(left.path).toBe('M 0 100 L 460 100 A 50 50 0 1 1 540 100');
    expect(right.path).toBe('M 1000 100 L 540 100 A 50 50 0 0 1 460 100');
    expect(left.length).toBeGreaterThan(right.length);
  });
});
