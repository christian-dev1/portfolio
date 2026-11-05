import { Injectable, Signal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, retry, take, tap } from 'rxjs';

/** Relance, sur toute la page, les chargements qui ont échoué (bouton « Réessayer »). */
@Injectable({ providedIn: 'root' })
export class ContentRetry {
  private readonly retries = new Subject<void>();
  readonly retries$ = this.retries.asObservable();

  retry(): void {
    this.retries.next();
  }
}

export interface Loadable<T> {
  /** `undefined` pendant le chargement ou après un échec ; ne relance jamais l'erreur. */
  readonly value: Signal<T | undefined>;
  readonly failed: Signal<boolean>;
}

/**
 * Remplace `toSignal` pour les données de l'API : un échec passe `failed` à true au lieu
 * de casser le rendu, et `ContentRetry.retry()` se réabonne à la source.
 * À appeler dans un contexte d'injection (champ de composant).
 */
export function loadable<T>(source: Observable<T>): Loadable<T> {
  const value = signal<T | undefined>(undefined);
  const failed = signal(false);
  const retries$ = inject(ContentRetry).retries$;

  source
    .pipe(
      tap({ next: (next) => value.set(next), error: () => failed.set(true) }),
      retry({
        delay: () =>
          retries$.pipe(
            take(1),
            tap(() => failed.set(false)),
          ),
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  return { value: value.asReadonly(), failed: failed.asReadonly() };
}
