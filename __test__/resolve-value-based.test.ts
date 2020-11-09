import { resolveValueBased } from '../src';

describe('Resolve Value Based', () => {

  type K = 'a' | 'b' | 'c' | 'd';
  type S = 'first' | 'last';
  type T = number;

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };
  const isSpecialKey = (value: unknown): value is S => Object.keys(special).includes(value as never);

  const isValidValue = (value: unknown): value is T => typeof value === 'number';
  const defaultValue = 0;

  const resolve = (value: unknown) => resolveValueBased<K, S, T>(
    value,
    keys,
    isKey,
    special,
    isSpecialKey,
    isValidValue,
    defaultValue,
  );

  test('Should resolve null value', () => {
    expect(resolve(null)).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
    expect(resolve(undefined)).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should resolve valid value', () => {
    expect(resolve(10)).toEqual({
      a: 10,
      b: 10,
      c: 10,
      d: 10,
    });
    expect(resolve(NaN)).toEqual({
      a: NaN,
      b: NaN,
      c: NaN,
      d: NaN,
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
