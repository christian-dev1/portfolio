export interface OrbitLayout {
  width: number;
  bandY: number;
  centerX: number;
  centerY: number;
  radius: number;
}

/** Arc length over which the text fades before the empty gap. */
export const FADE_LENGTH_PX = 6;
/** Fully transparent arc length immediately before the opposite junction. */
export const GAP_PX = 10;

export interface OrbitPoint {
  x: number;
  y: number;
}

/** Segment endpoints in the direction of travel. */
export interface OrbitSegment {
  from: OrbitPoint;
  to: OrbitPoint;
}

export interface OrbitTrack {
  path: string;
  length: number;
  fade: OrbitSegment;
  gap: OrbitSegment;
  gapPath: string;
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

  const pointBefore = (endX: number, distance: number): OrbitPoint => {
    const angle = distance / radius;
    const dx = endX - centerX;
    return {
      x: round(centerX + dx * Math.cos(angle) + offset * Math.sin(angle)),
      y: round(centerY + offset * Math.cos(angle) - dx * Math.sin(angle)),
    };
  };

  const ending = (endX: number) => {
    const gapStart = pointBefore(endX, GAP_PX);
    const junction = { x: round(endX), y: round(bandY) };
    const angle = Math.atan2(offset, endX - centerX);
    const outerRadius = radius + 8;
    const gapAngle = angle - GAP_PX / radius;
    const endAngle = angle + Math.PI / 2;
    const start = {
      x: round(centerX + outerRadius * Math.cos(gapAngle)),
      y: round(centerY + outerRadius * Math.sin(gapAngle)),
    };
    const end = {
      x: round(centerX + outerRadius * Math.cos(endAngle)),
      y: round(centerY + outerRadius * Math.sin(endAngle)),
    };
    // A black sector removes whole glyphs in the gap, including their overhang at the junction.
    const gapPath = `M ${round(centerX)} ${round(centerY)} L ${start.x} ${start.y} A ${round(outerRadius)} ${round(outerRadius)} 0 ${endAngle - gapAngle > Math.PI ? 1 : 0} 1 ${end.x} ${end.y} Z`;
    return {
      fade: { from: pointBefore(endX, GAP_PX + FADE_LENGTH_PX), to: gapStart },
      gap: { from: gapStart, to: junction },
      gapPath,
    };
  };

  const leftStart = 0;
  const rightStart = width;

  return {
    left: {
      path: `M ${round(leftStart)} ${round(bandY)} L ${round(entryX)} ${round(bandY)} ${arc(exitX, upperAngle)}`,
      length: round(entryX - leftStart + radius * upperAngle),
      ...ending(exitX),
    },
    right: {
      path: `M ${round(rightStart)} ${round(bandY)} L ${round(exitX)} ${round(bandY)} ${arc(entryX, lowerAngle)}`,
      length: round(rightStart - exitX + radius * lowerAngle),
      ...ending(entryX),
    },
  };
}
