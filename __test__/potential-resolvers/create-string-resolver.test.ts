import { createStringResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createStringResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createStringResolver<K, S>(
    keys,
    special,
  );

  const createExpected = (() => {
    const create = createExpectedCreator<K, boolean>((value) => ({
      a: value,
      b: value,
      c: value,
      d: value,
    }));
    return (keys: K[]) => create(false, keys, true);
  })();

  test('Should resolve key', () => {
    keys.forEach((key) => {
      const expected = createExpected([key]);
      expect(resolve(key)).toEqual(expected);
    });
  });

  test('Should resolve special key', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      const expected = createExpected(specialResolved);
      expect(resolve(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve to undefined if invalid', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
