import { createKeyResolver } from '../src';

describe('createKeyResolver function', () => {

  const colors = ['red', 'green', 'blue', 'white', 'black'] as const;

  type Color = (typeof colors)[number];

  const isColor = (color: unknown): color is Color => {
    return ['red', 'green', 'blue', 'white', 'black'].includes(color as never);
  };

  test('Should resolve key', () => {
    const resolveKey = createKeyResolver<Color>(isColor);
    colors.forEach((key) => {
      const resolved = resolveKey(key);
      expect(resolved).toEqual([key]);
    });
  });

  test('Should return undefined if key not found', () => {
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

  test('Should return undefined if key is invalid', () => {
    const invalidKeys = [
      0,
      1,
      true,
      false,
    ];
    const resolveKey = createKeyResolver<Color>(isColor);
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolveKey(invalidKey as never);
      expect(resolved).toBeUndefined();
    });
  });

});
