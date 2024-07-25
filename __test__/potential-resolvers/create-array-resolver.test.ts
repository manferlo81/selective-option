import { createArrayResolver } from '../../src';

describe('createArrayResolver function', () => {

  const keys: K[] = ['a', 'b', 'c', 'd'];

  type K = 'a' | 'b' | 'c' | 'd';
  type S = 'first' | 'last';

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createArrayResolver<K, S>(
    keys,
    special,
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
