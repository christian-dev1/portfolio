/**
 * Les types TypeScript ne vérifient pas les fichiers JSON chargés au runtime :
 * les tests `*.contract.spec.ts` garantissent que chaque ressource de `public/data/`
 * (un futur endpoint de l'API) respecte le contrat attendu par les modèles.
 */

export const KEBAB_CASE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const HTTPS_URL = /^https:\/\//;
export const PDF_URL = /^(\/|https:\/\/).+\.pdf$/;
export const PROJECT_IMAGE = /^\/images\/projects\/[a-z0-9-]+\.(png|jpe?g|webp|svg)$/;

export function expectUniqueKebabCaseIds(items: { id: string }[]): void {
  const ids = items.map((item) => item.id);

  expect(new Set(ids).size, 'ids must be unique').toBe(ids.length);
  for (const id of ids) {
    expect(id, `id "${id}" must be lowercase kebab-case`).toMatch(KEBAB_CASE_ID);
  }
}

export function expectLocalizedText(text: unknown, where: string): void {
  const localized = text as { fr?: unknown; en?: unknown };

  for (const lang of ['fr', 'en'] as const) {
    const value = localized?.[lang];
    expect(typeof value, `${where}.${lang} must be a string`).toBe('string');
    expect((value as string).trim(), `${where}.${lang} must not be empty`).not.toBe('');
  }
}

export function expectOneOf(value: string, allowed: readonly string[], where: string): void {
  expect(allowed, `${where} "${value}" is not allowed`).toContain(value);
}
