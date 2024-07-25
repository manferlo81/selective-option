import { createStringResolver } from '../../src';

describe('createStringResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = (typeof keys)[number];
  type S = (typeof specialKeys)[number];

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createStringResolver<K, S>(
    keys,
    special,
  );

  test('Should resolve key', () => {
    expect(resolve('c')).toEqual({
      a: false,
      b: false,
      c: true,
      d: false,
    });
    expect(resolve('d')).toEqual({
      a: false,
      b: false,
      c: false,
      d: true,
    });
  });

  test('Should resolve special key', () => {
    expect(resolve('first')).toEqual({
      a: true,
      b: true,
      c: false,
      d: false,
    });
    expect(resolve('last')).toEqual({
      a: false,
      b: false,
      c: true,
      d: true,
    });
  });

  test('Should resolve to undefined if invalid', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
