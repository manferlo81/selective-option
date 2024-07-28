import { createKeyListResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import type { ArrayItemType } from '../tools/helper-types';

describe('createArrayResolver function', () => {

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

  const negationSymbols = ['!', '-'] as const;

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
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve array with negative keys', () => {
    keys.forEach((key, i) => {
      const otherKey = keys[(i + 1) % keys.length];
      const input = [key, otherKey];
      const expected = createExpected(true, input, false);
      negationSymbols.forEach((negation) => {
        const negatedInput = input.map((key) => `${negation}${key}`);
        expect(resolve(negatedInput)).toEqual(expected);
      });
    });
  });

  test('Should resolve array with positive special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(false, special[specialKey], true);
      const input = [specialKey];
      expect(resolve(input)).toEqual(expected);
    });
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length];
      const input = [specialKey, otherKey];
      const expected = createExpected(false, [...special[specialKey], ...special[otherKey]], true);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve array with negative special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(true, special[specialKey], false);
      negationSymbols.forEach((negation) => {
        expect(resolve([`${negation}${specialKey}`])).toEqual(expected);
      });
    });
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length];
      const expected = createExpected(true, [...special[specialKey], ...special[otherKey]], false);
      negationSymbols.forEach((negation) => {
        const input = [specialKey, otherKey].map((key) => `${negation}${key}`);
        expect(resolve(input)).toEqual(expected);
      });
    });
  });

  test('Should resolve mixed keys', () => {
    type Negated<T extends string> = `!${T}` | `-${T}`;
    const inputs: Array<{ input: Array<K | Negated<K> | S | Negated<S>>; expected: ReturnType<typeof createExpected> }> = [
      { input: [], expected: createExpected(false) },
      { input: ['first', '-a'], expected: createExpected(false, ['b'], true) },
      { input: ['!last', 'a'], expected: createExpected(false, ['a', 'b'], true) },
    ];
    inputs.forEach(({ input, expected }) => {
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve to undefined if not array', () => {
    expect(resolve('invalid')).toBeUndefined();
  });

});
