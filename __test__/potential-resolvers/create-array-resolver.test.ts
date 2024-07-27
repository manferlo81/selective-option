import { createArrayResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import type { ArrayItemType } from '../tools/helper-types';

describe('createArrayResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createArrayResolver<K, S>(
    keys,
    special,
  );

  const createExpected = (() => {
    const create = createExpectedCreator<K, boolean>((value) => {
      return {
        a: value,
        b: value,
        c: value,
        d: value,
      };
    });
    return (keys: K[] = []) => create(false, keys, true);
  })();

  test('Should throw on invalid input', () => {
    const invalid = [
      ['invalid'],
      ['a', true],
      ['a', 10],
    ];
    invalid.forEach((input) => {
      expect(() => resolve(input)).toThrow();
    });
  });

  test('Should resolve array', () => {
    const expected = createExpected();
    expect(resolve([])).toEqual(expected);
  });

  test('Should resolve array with keys', () => {
    const expected = createExpected(['a', 'c']);
    expect(resolve(['a', 'c'])).toEqual(expected);
  });

  test('Should resolve array with special keys', () => {
    expect(resolve(['first'])).toEqual(createExpected(['a', 'b']));
    expect(resolve(['last'])).toEqual(createExpected(['c', 'd']));
  });

  test('Should resolve to undefined if not array', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
