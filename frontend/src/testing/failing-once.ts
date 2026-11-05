import { Observable, defer, of, throwError } from 'rxjs';

/** Source qui échoue au premier abonnement (API injoignable), puis renvoie `value`. */
export function failingOnce<T>(value: T): { source: Observable<T>; calls: () => number } {
  let calls = 0;
  const source = defer(() =>
    ++calls === 1 ? throwError(() => new Error('API unavailable')) : of(value),
  );
  return { source, calls: () => calls };
}
