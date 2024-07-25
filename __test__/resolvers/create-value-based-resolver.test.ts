import { createValueBasedResolver, KeyList, Resolved } from '../../src';

describe('createValueBasedResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;
  const overrideKey = 'default';

  type RegularKey = (typeof keys)[number];
  type SpecialKey = (typeof specialKeys)[number];
  type ValidValue = number;

  const special: Record<SpecialKey, RegularKey[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is ValidValue => typeof value === 'number';
  const defaultValue: ValidValue = 0;

  const resolve = createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    overrideKey,
    special,
  );

  const createExpected = <V extends ValidValue>(initial: V, keys?: KeyList<RegularKey>, value2?: V): Resolved<RegularKey, V | undefined> => {
    const expected: Resolved<RegularKey, V> = {
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
    const inputs: ValidValue[] = [
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
