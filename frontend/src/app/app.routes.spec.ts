import { Route, Routes } from '@angular/router';
import fr from '../../public/i18n/fr.json';
import en from '../../public/i18n/en.json';
import { routes } from './app.routes';
import { NAV_ITEMS } from './core/layout/navigation';

/** Lit une clé « a.b.c » dans un fichier de traduction. */
function translate(translations: object, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      translations,
    );
}

async function childRoutes(route: Route): Promise<Routes> {
  const loaded = await (route.loadChildren as () => Promise<Routes>)();
  return loaded;
}

describe('App routes', () => {
  it('should have a route for every menu item', () => {
    const paths = routes.map((route) => `/${route.path}`);

    for (const item of NAV_ITEMS) {
      expect(paths, `menu item ${item.path}`).toContain(item.path === '/' ? '/' : item.path);
    }
  });

  it('should give every page a tab title key translated in French and English', async () => {
    const lazyRoutes = routes.filter((route) => route.loadChildren);

    const pages = await Promise.all(lazyRoutes.map(childRoutes));
    for (const [page] of pages) {
      const key = page.title as string;

      expect(typeof translate(fr, key), `fr ${key}`).toBe('string');
      expect(typeof translate(en, key), `en ${key}`).toBe('string');
    }
    expect(lazyRoutes.length).toBe(NAV_ITEMS.length);
  });
});
