import { createValueResolver } from '../../src';

describe('createValueResolver function', () => {

  type K = 'a' | 'b' | 'c' | 'd';
  type V = boolean | 'auto';

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isValidValue = (value: unknown): value is V => [true, false, 'auto'].includes(value as never);

  const resolve = createValueResolver<K, V>(
    keys,
    isValidValue,
  );

  test('Should resolve valid value', () => {
    expect(resolve(true)).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
    });
    expect(resolve(false)).toEqual({
      a: false,
      b: false,
      c: false,
      d: false,
    });
    expect(resolve('auto')).toEqual({
      a: 'auto',
      b: 'auto',
      c: 'auto',
      d: 'auto',
    });
  });

  test('Should resolve to undefined if not valid value', () => {
    expect(resolve(null)).toBeUndefined();
    expect(resolve(undefined)).toBeUndefined();
  });

});
