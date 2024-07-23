import { resolveKey } from '../src/resolve-key';

describe('resolveKey function', () => {

  const colors = ['red', 'green', 'blue', 'white', 'black'] as const;

  type Color = (typeof colors)[number];

  const specialColors = {
    mono: ['white', 'black'] as Color[],
    color: ['red', 'green', 'blue'] as Color[],
  } as const;

  const isColor = (color: unknown): color is Color => {
    return ['red', 'green', 'blue', 'white', 'black'].includes(color as never);
  };

  test('Should resolve key', () => {
    colors.forEach((key) => {
      const resolved = resolveKey<Color>(key, isColor, specialColors);
      expect(resolved).toEqual([key]);
    });
  });

  test('Should resolve special key', () => {
    const specialKeys = Object.keys(specialColors) as Array<keyof typeof specialColors>;
    specialKeys.forEach((key) => {
      const resolved = resolveKey<Color>(key, isColor, specialColors);
      const expected = specialColors[key];
      expect(resolved).toEqual(expected);
    });
  });

  test('Should return undefined if is not a key and no special keys provided', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
    ];
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey<Color>(invalidKey, isColor);
      expect(resolved).toBeUndefined();
    });
  });

  test('Should return undefined if special key not found', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
    ];
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey<Color>(invalidKey, isColor, specialColors);
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
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey<Color>(invalidKey as never, isColor, specialColors);
      expect(resolved).toBeUndefined();
    });
  });

});
