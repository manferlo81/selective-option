import { createKeyResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createKeyResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const;
  const specialKeys = ['server', 'browser'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;

  const special: Record<S, K[]> = { server: ['node', 'deno'], browser: ['chrome', 'firefox'] };

  const resolve = createKeyResolver<K, S>(
    keys,
    special,
  );

  const createExpected = createExpectedCreator<K, boolean>((value) => ({
    node: value,
    deno: value,
    chrome: value,
    firefox: value,
  }));

  const positiveSign = '+';
  const positiveSymbols = ['', positiveSign] as const;
  const negativeSymbols = ['!', '-'] as const;

  test('Should resolve positive key', () => {
    keys.forEach((key) => {
      const expected = createExpected(false, [key], true);
      positiveSymbols.forEach((sign) => {
        expect(resolve(`${sign}${key}`)).toEqual(expected);
      });
    });
  });

  test('Should resolve negative key', () => {
    keys.forEach((key) => {
      const expected = createExpected(true, [key], false);
      negativeSymbols.forEach((sign) => {
        expect(resolve(`${sign}${key}`)).toEqual(expected);
      });
    });
  });

  test('Should resolve positive special key', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      const expected = createExpected(false, specialResolved, true);
      positiveSymbols.forEach((sign) => {
        expect(resolve(`${sign}${specialKey}`)).toEqual(expected);
      });
    });
  });

  test('Should resolve negative special key', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      const expected = createExpected(true, specialResolved, false);
      negativeSymbols.forEach((sign) => {
        expect(resolve(`${sign}${specialKey}`)).toEqual(expected);
      });
    });
  });

  test('Should not resolve if key is not valid', () => {
    const inputs = [
      'invalid',
      '!invalid',
      '+invalid',
      '-invalid',
      ...keys.map((key) => `! ${key}`),
      ...keys.map((key) => `+ ${key}`),
      ...keys.map((key) => `- ${key}`),
      ...specialKeys.map((key) => `! ${key}`),
      ...specialKeys.map((key) => `+ ${key}`),
      ...specialKeys.map((key) => `- ${key}`),
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

});
