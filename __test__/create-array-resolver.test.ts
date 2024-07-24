import { createArrayResolver, createKeyResolver, createMultiKeyResolver, createSpecialKeyResolver } from '../src';

describe('createArrayResolver function', () => {

  type K = 'a' | 'b' | 'c' | 'd';

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<string, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);
  const resolveMultiKey = createMultiKeyResolver(resolveKey, resolveSpecialKey);

  const resolve = createArrayResolver<K>(
    keys,
    resolveMultiKey,
  );

  test('Should throw on invalid input', () => {
    expect(() => resolve(['invalid'])).toThrow();
    expect(() => resolve(['a', true])).toThrow();
    expect(() => resolve(['a', 10])).toThrow();
  });

  test('Should resolve array', () => {
    expect(resolve([])).toEqual({
      a: false,
      b: false,
      c: false,
      d: false,
    });
  });

  test('Should resolve array with keys', () => {
    expect(resolve(['a', 'c'])).toEqual({
      a: true,
      b: false,
      c: true,
      d: false,
    });
  });

  test('Should resolve array with special keys', () => {
    expect(resolve(['first'])).toEqual({
      a: true,
      b: true,
      c: false,
      d: false,
    });
    expect(resolve(['last'])).toEqual({
      a: false,
      b: false,
      c: true,
      d: true,
    });
  });

  test('Should resolve to undefined if not array', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
