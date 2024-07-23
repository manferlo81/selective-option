import { resolveNullish } from '../../src';

describe('deprecated resolveNullish function', () => {

  type K = 'a' | 'b' | 'c' | 'd';
  type V = boolean | 'auto';

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const defaultValue = true;

  const resolve = (value: unknown) => resolveNullish<K, V>(
    value,
    keys,
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

  test('Should resolve to undefined if not nullish', () => {
    expect(resolve('')).toBeUndefined();
    expect(resolve(0)).toBeUndefined();
    expect(resolve([])).toBeUndefined();
    expect(resolve({})).toBeUndefined();
  });

});
