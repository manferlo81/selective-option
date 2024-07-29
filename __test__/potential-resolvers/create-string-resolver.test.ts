import { createKeyResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createKeyResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createKeyResolver<K, S>(
    keys,
    special,
  );

  const createExpected = createExpectedCreator<K, boolean>((value) => ({
    a: value,
    b: value,
    c: value,
    d: value,
  }));

  const negationSymbols = ['!', '-'];

  test('Should resolve positive key', () => {
    keys.forEach((key) => {
      const expected = createExpected(false, [key], true);
      expect(resolve(key)).toEqual(expected);
    });
  });

  test('Should resolve negative key', () => {
    keys.forEach((key) => {
      const expected = createExpected(true, [key], false);
      negationSymbols.forEach((sign) => {
        expect(resolve(`${sign}${key}`)).toEqual(expected);
      });
    });
  });

  test('Should resolve positive special key', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      const expected = createExpected(false, specialResolved, true);
      expect(resolve(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve negative special key', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      const expected = createExpected(true, specialResolved, false);
      negationSymbols.forEach((sign) => {
        expect(resolve(`${sign}${specialKey}`)).toEqual(expected);
      });
    });
  });

  test('Should resolve to undefined if invalid', () => {
    const inputs = [
      'invalid',
      '!invalid',
      keys.map((key) => `! ${key}`),
      keys.map((key) => `- ${key}`),
      specialKeys.map((key) => `! ${key}`),
      specialKeys.map((key) => `- ${key}`),
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

});
