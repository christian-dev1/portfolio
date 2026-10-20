export interface OrbitLayout {
  width: number;
  bandY: number;
  centerX: number;
  centerY: number;
  radius: number;
}

/** Length of path, just before the opposite junction, over which the text fades out. */
export const FADE_LENGTH_PX = 6;

export interface OrbitPoint {
  x: number;
  y: number;
}

/** Straight fade segment ending at the junction, along the direction of travel. */
export interface OrbitFade {
  from: OrbitPoint;
  to: OrbitPoint;
}

export interface OrbitTrack {
  path: string;
  length: number;
  fade: OrbitFade;
}

export interface OrbitTracks {
  left: OrbitTrack;
  right: OrbitTrack;
}

const round = (value: number) => Math.round(value * 10) / 10;

export function orbitTracks(layout: OrbitLayout): OrbitTracks {
  const { width, bandY, centerX, centerY, radius } = layout;
  const offset = Math.max(-radius, Math.min(radius, bandY - centerY));
  const halfChord = Math.sqrt(radius ** 2 - offset ** 2);
  const entryX = centerX - halfChord;
  const exitX = centerX + halfChord;
  // Both streams turn clockwise from the measured band into their own semicircle.
  const upperAngle = Math.PI + 2 * Math.asin(offset / radius);
  const lowerAngle = 2 * Math.PI - upperAngle;
  const arc = (endX: number, angle: number) =>
    `A ${round(radius)} ${round(radius)} 0 ${angle > Math.PI ? 1 : 0} 1 ${round(endX)} ${round(bandY)}`;

  // Clockwise tangent at a junction (x, bandY), then the fade segment that ends there.
  const fade = (endX: number): OrbitFade => {
    const tx = -offset / radius;
    const ty = (endX - centerX) / radius;
    return {
      from: { x: round(endX - tx * FADE_LENGTH_PX), y: round(bandY - ty * FADE_LENGTH_PX) },
      to: { x: round(endX), y: round(bandY) },
    };
  };

  const leftStart = 0;
  const rightStart = width;

  return {
    left: {
      path: `M ${round(leftStart)} ${round(bandY)} L ${round(entryX)} ${round(bandY)} ${arc(exitX, upperAngle)}`,
      length: round(entryX - leftStart + radius * upperAngle),
      fade: fade(exitX),
    },
    right: {
      path: `M ${round(rightStart)} ${round(bandY)} L ${round(exitX)} ${round(bandY)} ${arc(entryX, lowerAngle)}`,
      length: round(rightStart - exitX + radius * lowerAngle),
      fade: fade(entryX),
    },
  };
}
