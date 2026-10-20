import { DestroyRef, Signal, inject, signal } from '@angular/core';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Préférence « animations réduites » du système, suivie en direct.
 * À appeler dans un contexte d'injection. Sans `matchMedia` (tests, SSR), on considère
 * que le mouvement est autorisé : chaque animation garde de toute façon un état final visible.
 */
export function injectReducedMotion(): Signal<boolean> {
  const query = typeof matchMedia === 'function' ? matchMedia(REDUCED_MOTION_QUERY) : undefined;
  const reduced = signal(query?.matches ?? false);

  if (query?.addEventListener) {
    const onChange = (event: MediaQueryListEvent) => reduced.set(event.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }

  return reduced.asReadonly();
}
