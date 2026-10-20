export interface OrbitLayout {
  width: number;
  bandY: number;
  centerX: number;
  centerY: number;
  radius: number;
}

export interface OrbitTrack {
  path: string;
  length: number;
  fadeFrom: number;
  fadeTo: number;
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

  const leftStart = 0;
  const rightStart = width;

  return {
    left: {
      path: `M ${round(leftStart)} ${round(bandY)} L ${round(entryX)} ${round(bandY)} ${arc(exitX, upperAngle)}`,
      length: round(entryX - leftStart + radius * upperAngle),
      fadeFrom: round(centerX),
      fadeTo: round(exitX),
    },
    right: {
      path: `M ${round(rightStart)} ${round(bandY)} L ${round(exitX)} ${round(bandY)} ${arc(entryX, lowerAngle)}`,
      length: round(rightStart - exitX + radius * lowerAngle),
      fadeFrom: round(width - centerX),
      fadeTo: round(width - entryX),
    },
  };
}
