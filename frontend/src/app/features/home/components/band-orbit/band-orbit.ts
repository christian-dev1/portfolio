import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { BrandIcon } from '../../../../shared/ui/brand-icon/brand-icon';
import { BrandIcon as BrandIconData } from '../../../../shared/ui/brand-icons';
import { injectReducedMotion } from '../../../../shared/ui/motion/reduced-motion';
import { OrbitLayout, orbitLogoCount, orbitTracks } from './orbit-path';

/** Diamètre d'un logo, en px. */
const LOGO_SIZE = 22;
/** Espace entre l'anneau de la photo et les logos qui en font le tour. */
const RING_GAP = 3;
/** Vitesse constante des logos, en px par seconde. */
const SPEED = 36;

interface OrbitStream {
  side: 'left' | 'right';
  path: string;
  duration: number;
  fadeFrom: number;
  fadeTo: number;
  logos: { icon: BrandIconData; delay: number }[];
}

export function supportsOffsetPath(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports?.('offset-path', "path('M 0 0')") === true;
}

/**
 * Petits logos qui glissent sur la bande rouge du hero puis s'enroulent autour de l'anneau
 * de la photo (décor, masqué aux lecteurs d'écran : la liste des technologies est dans le hero).
 * Les trajectoires sont recalculées à partir des positions réelles à chaque redimensionnement.
 * Rien n'est affiché avec les animations réduites ou sans support de `offset-path`.
 */
@Component({
  selector: 'app-band-orbit',
  imports: [BrandIcon],
  templateUrl: './band-orbit.html',
  styleUrl: './band-orbit.scss',
  host: {
    'aria-hidden': 'true',
    '[style.--orbit-logo-size.px]': 'logoSize',
  },
})
export class BandOrbit {
  readonly icons = input.required<BrandIconData[]>();
  /** Bande rouge : les logos suivent le milieu de son épaisseur. */
  readonly band = input.required<HTMLElement>();
  /** Rond de la photo, anneau compris. */
  readonly ring = input.required<HTMLElement>();

  protected readonly logoSize = LOGO_SIZE;

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly reducedMotion = injectReducedMotion();
  private readonly layout = signal<OrbitLayout | null>(null);

  protected readonly streams = computed<OrbitStream[]>(() => {
    const layout = this.layout();
    if (!layout || this.reducedMotion()) {
      return [];
    }

    const tracks = orbitTracks(layout);
    const count = orbitLogoCount(layout.width);

    return (['left', 'right'] as const).map((side, parity) => {
      const track = tracks[side];
      const duration = track.length / SPEED;
      // Un logo sur deux par flux, pour que les deux flux ne montrent pas les mêmes.
      const icons = this.icons()
        .filter((_, index) => index % 2 === parity)
        .slice(0, count);
      return {
        side,
        path: `path('${track.path}')`,
        duration,
        fadeFrom: track.fadeFrom,
        fadeTo: track.fadeTo,
        // Délais négatifs : les logos sont déjà répartis sur le trajet au premier affichage.
        logos: icons.map((icon, index) => ({ icon, delay: -(index * duration) / icons.length })),
      };
    });
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!supportsOffsetPath() || typeof ResizeObserver !== 'function') {
        return;
      }
      const observer = new ResizeObserver(() => this.measure());
      observer.observe(this.host);
      observer.observe(this.ring());
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private measure(): void {
    const origin = this.host.getBoundingClientRect();
    const band = this.band().getBoundingClientRect();
    const ring = this.ring().getBoundingClientRect();

    this.layout.set({
      width: origin.width,
      bandY: band.top + band.height / 2 - origin.top,
      centerX: ring.left + ring.width / 2 - origin.left,
      centerY: ring.top + ring.height / 2 - origin.top,
      radius: ring.width / 2 + RING_GAP + LOGO_SIZE / 2,
      logoSize: LOGO_SIZE,
    });
  }
}
