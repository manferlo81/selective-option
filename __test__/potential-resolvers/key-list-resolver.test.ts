import { createKeyListResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import type { ArrayItemType } from '../tools/helper-types';

describe('createKeyListResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const resolve = createKeyListResolver<K, S>(
    keys,
    special,
  );

  const createExpected = createExpectedCreator<K, boolean>((value) => {
    return {
      a: value,
      b: value,
      c: value,
      d: value,
    };
  });

  const positiveSymbols = ['', '+'] as const;
  const negativeSymbols = ['!', '-'] as const;

  test('Should throw on invalid input', () => {
    const invalid = [
      ['invalid'],
      ['a', true],
      ['a', 10],
      ['! a', 'b'],
      ['a', '! b'],
    ];
    invalid.forEach((input) => {
      expect(() => resolve(input)).toThrow();
    });
  });

  test('Should resolve array', () => {
    const expected = createExpected(false);
    expect(resolve([])).toEqual(expected);
  });

  test('Should resolve array with positive keys', () => {
    keys.forEach((key, i) => {
      const otherKey = keys[(i + 1) % keys.length];
      const input = [key, otherKey];
      const expected = createExpected(false, input, true);
      positiveSymbols.forEach((sign) => {
        const positiveInput = input.map((key) => `${sign}${key}`);
        expect(resolve(positiveInput)).toEqual(expected);
      });
    });
  });

  test('Should resolve array with negative keys', () => {
    keys.forEach((key, i) => {
      const otherKey = keys[(i + 1) % keys.length];
      const input = [key, otherKey];
      const expected = createExpected(true, input, false);
      negativeSymbols.forEach((sign) => {
        const negativeInput = input.map((key) => `${sign}${key}`);
        expect(resolve(negativeInput)).toEqual(expected);
      });
    });
  });

  test('Should resolve array with positive special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(false, special[specialKey], true);
      positiveSymbols.forEach((sign) => {
        const input = [`${sign}${specialKey}`];
        expect(resolve(input)).toEqual(expected);
      });
    });
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length];
      const expected = createExpected(false, [...special[specialKey], ...special[otherKey]], true);
      positiveSymbols.forEach((sign) => {
        const input = [specialKey, otherKey].map((key) => `${sign}${key}`);
        expect(resolve(input)).toEqual(expected);
      });
    });
  });

  test('Should resolve array with negative special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(true, special[specialKey], false);
      negativeSymbols.forEach((negation) => {
        expect(resolve([`${negation}${specialKey}`])).toEqual(expected);
      });
    });
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length];
      const expected = createExpected(true, [...special[specialKey], ...special[otherKey]], false);
      negativeSymbols.forEach((negation) => {
        const input = [specialKey, otherKey].map((key) => `${negation}${key}`);
        expect(resolve(input)).toEqual(expected);
      });
    });
  });

  test('Should resolve mixed keys', () => {
    type ModifiedKey<T extends string> = `!${T}` | `+${T}` | `-${T}`;
    const inputs: Array<{ input: Array<K | S | ModifiedKey<K | S>>; expected: ReturnType<typeof createExpected> }> = [
      { input: [], expected: createExpected(false) },
      { input: ['first', '-a'], expected: createExpected(false, ['b'], true) },
      { input: ['!last', 'a'], expected: createExpected(false, ['a', 'b'], true) },
      { input: ['!last', '+a'], expected: createExpected(false, ['a', 'b'], true) },
    ];
    inputs.forEach(({ input, expected }) => {
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve to undefined if not array', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
