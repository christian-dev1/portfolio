import fr from '../../public/i18n/fr.json';
import en from '../../public/i18n/en.json';

/** Aplatit un objet imbriqué en liste de chemins triés : { a: { b: 'x' } } → ['a.b'] */
function keysOf(obj: object, prefix = ''): string[] {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'object' && value !== null ? keysOf(value, path) : [path];
    })
    .sort();
}

/** Même principe, mais renvoie les valeurs (les textes traduits) au lieu des chemins */
function valuesOf(obj: object): unknown[] {
  return Object.values(obj).flatMap((value) =>
    typeof value === 'object' && value !== null ? valuesOf(value) : [value],
  );
}

describe('Translations', () => {
  it('keysOf should flatten nested keys into sorted paths', () => {
    // Arrange
    const sample = { b: { y: 'texte', x: 'texte' }, a: 'texte' };

    // Act
    const keys = keysOf(sample);

    // Assert
    expect(keys).toEqual(['a', 'b.x', 'b.y']);
  });

  it('should have exactly the same keys in French and English', () => {
    expect(keysOf(en)).toEqual(keysOf(fr));
  });

  it('should not contain any empty translation', () => {
    const allValues = [...valuesOf(fr), ...valuesOf(en)];

    for (const value of allValues) {
      expect(typeof value).toBe('string');
      expect((value as string).trim()).not.toBe('');
    }
  });
});
