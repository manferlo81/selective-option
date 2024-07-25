import { createValueBasedResolver, Keys, Resolved } from '../../src';

describe('createValueBasedResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = (typeof keys)[number];
  type V = number;
  type S = (typeof specialKeys)[number];

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is V => typeof value === 'number';
  const defaultValue: V = 0;

  const resolve = createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    'default',
    special,
  );

  const createExpected = <X extends V | boolean>(initial: X, keys?: Keys<K>, value2?: X): Resolved<K, X | undefined> => {
    const expected: Resolved<K, X> = {
      a: initial,
      b: initial,
      c: initial,
      d: initial,
    };
    if (!keys) return expected;
    return keys.reduce((output, key) => {
      return { ...output, [key]: value2 };
    }, expected);
  };

  test('Should throw on invalid value', () => {
    expect(() => resolve(true as never)).toThrow();
  });

  test('Should resolve null value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      const expected = createExpected(defaultValue);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve valid value', () => {
    const inputs = [
      10,
      NaN,
    ];
    inputs.forEach((input) => {
      const expected = createExpected(input);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve object', () => {
    const expected = createExpected(defaultValue);
    expect(resolve({})).toEqual(expected);
  });

  test('Should resolve object with default value', () => {
    const newDefaultValue = 99;
    const expected = createExpected(newDefaultValue);
    expect(resolve({ default: newDefaultValue })).toEqual(expected);
  });

});
