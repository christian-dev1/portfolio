import { DOCUMENT, InjectionToken, inject } from '@angular/core';

/** Partie de `window.location` utile au mode « complet » ; remplaçable dans les tests. */
export type PageLocation = Pick<Location, 'hostname' | 'search'>;

export const PAGE_LOCATION = new InjectionToken<PageLocation>('PAGE_LOCATION', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).location,
});

const LOCAL_HOSTNAMES: readonly string[] = ['localhost', '127.0.0.1'];

/**
 * CV « complet » (avec les numéros de téléphone) : uniquement en local, avec `?complet=1`.
 * Partout ailleurs, et donc en production, le paramètre est ignoré.
 */
export function isCompleteCv(location: PageLocation): boolean {
  return (
    LOCAL_HOSTNAMES.includes(location.hostname) &&
    new URLSearchParams(location.search).get('complet') === '1'
  );
}
