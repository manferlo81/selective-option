import { BoolBasedSelectiveOption, resolveBoolBased } from '../../src';

describe('deprecated resolveBoolBased function', () => {

  const keys = ['square', 'rectangle', 'circle', 'oval'] as const;
  const literalSizes = ['small', 'large', 'random'] as const;

  type K = (typeof keys)[number];
  type V = number | (typeof literalSizes)[number];
  type S = 'rectangular' | 'elliptical';

  const isKey = (value: unknown): value is K => keys.includes(value as never);
  const isValidValue = (value: unknown): value is V => typeof value === 'number' || literalSizes.includes(value as never);

  const special: Record<S, K[]> = { rectangular: ['square', 'rectangle'], elliptical: ['circle', 'oval'] };
  const specialKeys = Object.keys(special) as S[];
  const defaultValue: V = 'random';

  const createResult = <X extends V | boolean>(value: X): Readonly<Record<K, X>> => {
    return {
      square: value,
      rectangle: value,
      circle: value,
      oval: value,
    };
  };

  const resolve = (value: BoolBasedSelectiveOption<K | S, number, 'default'>) => resolveBoolBased(
    value,
    keys,
    isKey,
    special,
    isValidValue,
    defaultValue,
  );

  test('Should throw on invalid value', () => {
    expect(() => resolve('string' as never)).toThrow();
  });

  test('Should resolve null value', () => {
    expect(resolve(null)).toEqual(createResult(defaultValue));
    expect(resolve(undefined)).toEqual(createResult(defaultValue));
  });

  test('Should resolve valid value', () => {
    expect(resolve(10)).toEqual(createResult(10));
    expect(resolve(NaN)).toEqual(createResult(NaN));
  });

  test('Should resolve key', () => {
    const falseResult = createResult(false);
    keys.forEach((key) => {
      expect(resolve(key)).toEqual({
        ...falseResult,
        [key]: true,
      });
    });
  });

  test('Should resolve special key', () => {
    const falseResult = createResult(false);
    specialKeys.forEach((specialKey) => {
      const keys = special[specialKey];
      const expected = keys.reduce((output, key) => {
        return { ...output, [key]: true };
      }, falseResult);
      expect(resolve(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve array', () => {
    expect(resolve([])).toEqual(createResult(false));
  });

  test('Should resolve array of keys', () => {
    expect(resolve(['square', 'oval'])).toEqual({
      ...createResult(false),
      square: true,
      oval: true,
    });
  });

  test('Should resolve array of special keys', () => {
    expect(resolve(['rectangular'])).toEqual({
      ...createResult(false),
      rectangle: true,
      square: true,
    });
    expect(resolve(['elliptical'])).toEqual({
      ...createResult(false),
      circle: true,
      oval: true,
    });
  });

  test('Should resolve array of mixed keys', () => {
    expect(resolve(['rectangular', 'oval'])).toEqual({
      ...createResult(false),
      rectangle: true,
      square: true,
      oval: true,
    });
  });

  test('Should resolve object', () => {
    expect(resolve({})).toEqual(createResult(defaultValue));
  });

  test('Should resolve object with default value', () => {
    const overrideValue = 99;
    expect(resolve({ default: overrideValue })).toEqual(createResult(overrideValue));
  });

});
