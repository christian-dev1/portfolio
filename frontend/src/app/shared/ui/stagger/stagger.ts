import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { injectReducedMotion } from '../motion/reduced-motion';

/** Au-delà, les enfants apparaissent ensemble : une longue liste n'attend pas. */
const MAX_STAGGERED = 8;

/**
 * Fait apparaître les enfants directs d'une liste l'un après l'autre (voir `.stagger` dans
 * `styles.scss`) quand elle entre dans la fenêtre. Les enfants ne sont masqués qu'une fois
 * l'observateur prêt : sans IntersectionObserver ou avec les animations réduites, tout reste visible.
 */
@Directive({
  selector: '[appStagger]',
  host: { class: 'stagger' },
})
export class Stagger {
  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const reducedMotion = injectReducedMotion();
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (reducedMotion() || typeof IntersectionObserver !== 'function') {
        return;
      }

      Array.from(host.children).forEach((child, index) =>
        (child as HTMLElement).style.setProperty(
          '--stagger-index',
          String(Math.min(index, MAX_STAGGERED)),
        ),
      );
      host.classList.add('stagger--armed');

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            host.classList.add('stagger--in');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
