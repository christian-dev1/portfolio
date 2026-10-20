/** Positions mesurées dans la zone des logos (origine en haut à gauche, en px). */
export interface OrbitLayout {
  /** Largeur de la zone : les flux partent de ses bords. */
  width: number;
  /** Ordonnée du milieu de l'épaisseur de la bande rouge. */
  bandY: number;
  centerX: number;
  centerY: number;
  /** Rayon du cercle suivi par le centre des logos, autour de l'anneau. */
  radius: number;
  /** Diamètre d'un logo : il naît juste hors du bord, sans apparaître d'un coup. */
  logoSize: number;
}

export interface OrbitTrack {
  /** Chaîne `d` d'un tracé SVG, utilisée dans `offset-path: path(…)`. */
  path: string;
  /** Longueur du tracé, pour garder la même vitesse quelle que soit la largeur. */
  length: number;
  /** Fondu, compté depuis le bord de départ du flux : opaque jusqu'à `fadeFrom`, invisible à `fadeTo`. */
  fadeFrom: number;
  fadeTo: number;
}

export interface OrbitTracks {
  /** Depuis le bord gauche, le long de la bande, puis par l'arc supérieur de l'anneau. */
  left: OrbitTrack;
  /** Depuis le bord droit, le long de la bande, puis par l'arc inférieur de l'anneau. */
  right: OrbitTrack;
}

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Trajectoires des deux flux de logos : un segment sur la bande jusqu'au cercle, puis un demi-tour
 * (ou presque, si la bande n'est pas au centre de l'anneau) jusqu'au point d'en face, où le logo
 * finit de s'estomper. Les deux arcs tournent dans le sens horaire de l'écran (`sweep = 1`).
 */
export function orbitTracks(layout: OrbitLayout): OrbitTracks {
  const { width, bandY, centerX, centerY, radius, logoSize } = layout;
  const offset = Math.max(-radius, Math.min(radius, bandY - centerY));
  const halfChord = Math.sqrt(radius ** 2 - offset ** 2);
  const entryX = centerX - halfChord;
  const exitX = centerX + halfChord;
  // Angle parcouru au-dessus (ou au-dessous) de la corde formée par la bande.
  const upperAngle = Math.PI + 2 * Math.asin(offset / radius);
  const lowerAngle = 2 * Math.PI - upperAngle;
  const arc = (endX: number, angle: number) =>
    `A ${round(radius)} ${round(radius)} 0 ${angle > Math.PI ? 1 : 0} 1 ${round(endX)} ${round(bandY)}`;

  const leftStart = -logoSize;
  const rightStart = width + logoSize;

  return {
    left: {
      path: `M ${round(leftStart)} ${round(bandY)} L ${round(entryX)} ${round(bandY)} ${arc(exitX, upperAngle)}`,
      length: round(entryX - leftStart + radius * upperAngle),
      fadeFrom: round(centerX),
      fadeTo: round(exitX - logoSize / 2),
    },
    right: {
      path: `M ${round(rightStart)} ${round(bandY)} L ${round(exitX)} ${round(bandY)} ${arc(entryX, lowerAngle)}`,
      length: round(rightStart - exitX + radius * lowerAngle),
      fadeFrom: round(width - centerX),
      fadeTo: round(width - entryX - logoSize / 2),
    },
  };
}

/** Nombre de logos par flux : moins sur petit écran, où la bande est courte. */
export function orbitLogoCount(width: number): number {
  if (width < 640) {
    return 3;
  }
  return width < 1100 ? 5 : 7;
}
