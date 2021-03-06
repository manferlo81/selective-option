import { createStringResolver } from '../src';

describe('Resolve Bool Strings', () => {

  type K = 'a' | 'b' | 'c' | 'd';

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<string, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createStringResolver<K>(
    keys,
    isKey,
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
