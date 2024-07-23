import { createKeyResolver } from '../../src/resolvers/key';

describe('createKeyResolver function', () => {

  const colors = ['red', 'green', 'blue', 'white', 'black'] as const;

  type Color = (typeof colors)[number];

  const specialColors = {
    mono: ['white', 'black'] as Color[],
    color: ['red', 'green', 'blue'] as Color[],
  } as const;

  const isColor = (color: unknown): color is Color => {
    return ['red', 'green', 'blue', 'white', 'black'].includes(color as never);
  };

  test('Should throw if special values is not an array', () => {
    const invalidKeys = [
      5,
    ];
    invalidKeys.forEach((keys) => {
      const create = () => createKeyResolver(isColor, { 'color': keys as never });
      expect(create).toThrow();
    });
  });

  test('Should throw if special values has invalid keys', () => {
    const invalidKeys = [
      ['lime', 'non-color', 3, true],
      ['lime', 'non-color'],
      ['red', 'non-color'],
      ['non-color', 'blue'],
    ];
    invalidKeys.forEach((keys) => {
      const create = () => createKeyResolver(isColor, { 'color': keys as never });
      expect(create).toThrow();
    });
  });

  test('Should resolve key', () => {
    const resolveKey = createKeyResolver<Color>(isColor, specialColors);
    colors.forEach((key) => {
      const resolved = resolveKey(key);
      expect(resolved).toEqual([[key], false]);
    });
  });

  test('Should resolve special key', () => {
    const specialKeys = Object.keys(specialColors) as Array<keyof typeof specialColors>;
    const resolveKey = createKeyResolver<Color>(isColor, specialColors);
    specialKeys.forEach((key) => {
      const resolved = resolveKey(key);
      const expected = specialColors[key];
      expect(resolved).toEqual([expected, true]);
    });
  });

  test('Should return undefined if is not a key and no special keys provided', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
    ];
    const resolveKey = createKeyResolver<Color>(isColor);
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey(invalidKey);
      expect(resolved).toBeUndefined();
    });
  });

  test('Should return undefined if special key not found', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
    ];
    const resolveKey = createKeyResolver<Color>(isColor, specialColors);
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey(invalidKey);
      expect(resolved).toBeUndefined();
    });
  });

  test('Should return undefined if key is invalid', () => {
    const invalidKeys = [
      0,
      1,
      true,
      false,
    ];
    const resolveKey = createKeyResolver<Color>(isColor, specialColors);
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey(invalidKey as never);
      expect(resolved).toBeUndefined();
    });
  });

});
