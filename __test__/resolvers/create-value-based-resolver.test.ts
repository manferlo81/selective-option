import { createValueBasedResolver } from '../../src';

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

  test('Should throw on invalid value', () => {
    expect(() => resolve(true as never)).toThrow();
  });

  test('Should resolve null value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toEqual({
        a: defaultValue,
        b: defaultValue,
        c: defaultValue,
        d: defaultValue,
      });
    });
  });

  test('Should resolve valid value', () => {
    const inputs = [
      10,
      NaN,
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toEqual({
        a: input,
        b: input,
        c: input,
        d: input,
      });
    });
  });

  test('Should resolve object', () => {
    expect(resolve({})).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should resolve object with default value', () => {
    const newDefaultValue = 99;
    expect(resolve({ default: newDefaultValue })).toEqual({
      a: newDefaultValue,
      b: newDefaultValue,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

});
