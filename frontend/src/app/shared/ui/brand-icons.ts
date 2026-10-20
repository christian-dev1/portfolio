import {
  SimpleIcon,
  siAngular,
  siCypress,
  siDocker,
  siFacebook,
  siGit,
  siGithub,
  siGitlab,
  siGmail,
  siInstagram,
  siIntellijidea,
  siJunit5,
  siLinkedin,
  siLinux,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siSnapchat,
  siSpringboot,
  siSwagger,
  siTiktok,
  siTypescript,
  siVitest,
  siWordpress,
  siYoutube,
} from 'simple-icons';

/**
 * Seuls les logos listés ici sont embarqués dans le bundle (imports nommés).
 * La clé est le slug simple-icons utilisé dans les données (`tools.json`, réseaux sociaux).
 */
const SOURCES = {
  angular: siAngular,
  cypress: siCypress,
  docker: siDocker,
  facebook: siFacebook,
  git: siGit,
  github: siGithub,
  gitlab: siGitlab,
  gmail: siGmail,
  instagram: siInstagram,
  intellijidea: siIntellijidea,
  junit5: siJunit5,
  linkedin: siLinkedin,
  linux: siLinux,
  openjdk: siOpenjdk,
  postgresql: siPostgresql,
  postman: siPostman,
  snapchat: siSnapchat,
  springboot: siSpringboot,
  swagger: siSwagger,
  tiktok: siTiktok,
  typescript: siTypescript,
  vitest: siVitest,
  wordpress: siWordpress,
  youtube: siYoutube,
} satisfies Record<string, SimpleIcon>;

export type BrandIconSlug = keyof typeof SOURCES;

export interface BrandIcon {
  title: string;
  /** Tracé SVG (viewBox 0 0 24 24). */
  path: string;
  /** Couleur officielle, ex. `#2496ED`. */
  hex: string;
  /** Couleur d'affichage sur la page ; `null` = `currentColor` (logo trop sombre pour le thème sombre). */
  color: string | null;
  /** Couleur du logo quand le fond prend la couleur officielle : clair ou foncé selon le contraste. */
  inkOnHex: 'light' | 'dark';
}

/** Couleurs officielles remplacées (ex. Angular est noir chez simple-icons, rouge dans sa charte). */
const HEX_OVERRIDES: Partial<Record<BrandIconSlug, string>> = {
  angular: '#DD0031',
};

/** Valeur de `--color-background` en thème sombre : référence pour juger la lisibilité d'un logo. */
const DARK_THEME_BACKGROUND = '#0a1230';
const WHITE = '#ffffff';
/** Contraste minimal des éléments graphiques (WCAG 1.4.11). */
const MIN_GRAPHIC_CONTRAST = 3;

export function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: string, second: string): number {
  const [light, dark] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function toBrandIcon(slug: BrandIconSlug): BrandIcon {
  const source: SimpleIcon = SOURCES[slug];
  const hex = HEX_OVERRIDES[slug] ?? `#${source.hex}`;
  return {
    title: source.title,
    path: source.path,
    hex,
    color: contrastRatio(hex, DARK_THEME_BACKGROUND) >= MIN_GRAPHIC_CONTRAST ? hex : null,
    inkOnHex: contrastRatio(hex, WHITE) >= MIN_GRAPHIC_CONTRAST ? 'light' : 'dark',
  };
}

export const BRAND_ICONS: Record<BrandIconSlug, BrandIcon> = Object.fromEntries(
  (Object.keys(SOURCES) as BrandIconSlug[]).map((slug) => [slug, toBrandIcon(slug)]),
) as Record<BrandIconSlug, BrandIcon>;

export function isBrandIconSlug(value: string): value is BrandIconSlug {
  return Object.hasOwn(BRAND_ICONS, value);
}
