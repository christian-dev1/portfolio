import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';

const DURATION_MS = 900;

/**
 * Affiche un nombre qui monte de 0 à sa valeur la première fois qu'il entre à l'écran.
 * La valeur réelle reste dans le DOM (texte hors écran, `aria-label`, `data-value`) :
 * sans IntersectionObserver ou avec « animations réduites », elle est affichée directement.
 */
@Directive({
  selector: '[appCountUp]',
  host: {
    '[attr.aria-label]': 'formatted()',
    '[attr.data-value]': 'formatted()',
  },
})
export class CountUp {
  readonly appCountUp = input.required<number>();
  /** Nombre minimal de chiffres (zéros à gauche), ex. 2 → « 04 ». */
  readonly countUpDigits = input(2);

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly window = inject(DOCUMENT).defaultView;
  private observer?: IntersectionObserver;
  private frame = 0;
  private animated = false;

  protected readonly formatted = computed(() => this.format(this.appCountUp()));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
    effect(() => {
      const value = this.appCountUp();
      untracked(() => this.render(value));
    });
  }

  private render(value: number): void {
    this.stop();
    if (this.animated || !this.canAnimate()) {
      this.write(value);
      return;
    }
    const win = this.window!;
    // Déjà visible : on part de 0 tout de suite (pas d'éclair de la valeur finale).
    // Hors écran : la valeur réelle reste affichée jusqu'à l'apparition.
    const rect = this.host.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < win.innerHeight;
    this.write(inView ? 0 : value);
    this.observer = new win.IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.observer?.disconnect();
        this.animate(value);
      }
    });
    this.observer.observe(this.host);
  }

  private animate(target: number): void {
    const win = this.window!;
    this.animated = true;
    // Départ = horodatage de la première image (même horloge que les images suivantes).
    let start: number | undefined;
    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - (1 - progress) ** 3;
      this.write(Math.round(target * eased));
      if (progress < 1) {
        this.frame = win.requestAnimationFrame(step);
      }
    };
    this.frame = win.requestAnimationFrame(step);
  }

  private canAnimate(): boolean {
    const win = this.window;
    return (
      !!win &&
      typeof win.IntersectionObserver === 'function' &&
      typeof win.requestAnimationFrame === 'function' &&
      !win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    );
  }

  private stop(): void {
    this.observer?.disconnect();
    if (this.frame) {
      this.window?.cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private write(value: number): void {
    this.host.textContent = this.format(value);
  }

  private format(value: number): string {
    return String(value).padStart(this.countUpDigits(), '0');
  }
}
