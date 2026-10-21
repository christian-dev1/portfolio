import { injectReducedMotion } from '../../../../shared/ui/motion/reduced-motion';
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
import { FADE_LENGTH_PX, GAP_PX, OrbitLayout, orbitTracks } from './orbit-path';

let nextId = 0;

@Component({
  selector: 'app-band-orbit',
  templateUrl: './band-orbit.html',
  styleUrl: './band-orbit.scss',
  host: { 'aria-hidden': 'true' },
})
export class BandOrbit {
  protected readonly reducedMotion = injectReducedMotion();
  readonly text = input.required<string>();
  readonly band = input.required<HTMLElement>();
  readonly ring = input.required<HTMLElement>();
  protected readonly id = `band-orbit-${nextId++}`;
  /** The local mask covers the fade, gap and full glyph height around the junction. */
  protected readonly fadeZone = FADE_LENGTH_PX + GAP_PX + 8;
  protected readonly layout = signal<OrbitLayout | null>(null);
  private readonly fontsReady = signal(false);
  protected readonly period = computed(() => {
    this.fontsReady();
    const text = this.text();
    const context = document.createElement('canvas').getContext('2d');
    if (!context) return 1000;
    context.font = '700 6px "Space Grotesk"';
    return Math.max(context.measureText(text).width + text.length * 0.72, 1);
  });
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly streams = computed(() => {
    const layout = this.layout();
    if (!layout) return [];
    const tracks = orbitTracks(layout);
    return (['left', 'right'] as const).map((side) => ({ side, ...tracks[side] }));
  });
  protected readonly repeatedText = computed(() => {
    const length = Math.max(...this.streams().map((stream) => stream.length), 0);
    return this.text().repeat(Math.ceil(length / this.period()) + 3);
  });
  protected readonly textLength = computed(
    () => (this.repeatedText().length / Math.max(this.text().length, 1)) * this.period(),
  );
  protected readonly donut = computed(() => {
    const l = this.layout();
    if (!l) return '';
    const { centerX: x, centerY: y, radius } = l;
    const circle = (r: number) =>
      `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
    return `${circle(radius + 4)} ${circle(radius - 4)}`;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (typeof ResizeObserver !== 'function') return;
      const observer = new ResizeObserver(() => this.measure());
      observer.observe(this.host);
      observer.observe(this.ring());
      observer.observe(this.band());
      this.measure();
      void document.fonts?.ready.then(() => {
        if (!destroyRef.destroyed) this.fontsReady.set(true);
      });
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
      radius: ring.width / 2 - 4,
    });
  }
}
