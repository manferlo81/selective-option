import { createFunctionResolver, FunctionOption, Resolved } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import type { ArrayItemType } from '../tools/helper-types';

describe('createFunctionResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const;
  const validValues = [true, false, 'auto'] as const;
  const defaultValue = 0;

  type K = ArrayItemType<typeof keys>;
  type V = ArrayItemType<typeof validValues>;
  type D = typeof defaultValue;

  const isValidValue = (value: unknown): value is V => validValues.includes(value as never);

  const resolve = createFunctionResolver<K, V, D>(
    keys,
    isValidValue,
    defaultValue,
  );

  const createExpected = createExpectedCreator<K, V | D>((value) => ({
    node: value,
    deno: value,
    chrome: value,
    firefox: value,
  }));

  test('Should not resolve if input is not a function', () => {
    const nonFunctionInputs = [
      0,
      1,
      NaN,
      Infinity,
      '',
      'string',
      true,
      false,
      [],
      {},
    ];
    nonFunctionInputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

  test('Should throw if input function returns invalid value', () => {
    const invalidValues = [
      [],
      {},
      0,
      1,
      '',
      'string',
    ];
    invalidValues.forEach((value) => {
      const input = () => value;
      const exec = () => resolve(input);
      expect(exec).toThrow();
    });
  });

  test('Should resolve if input function returns valid value', () => {
    validValues.forEach((value) => {
      const input = () => value;
      const expected = createExpected(value);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve to default if input function returns nullish', () => {
    const nullishValues = [
      null,
      undefined,
    ];
    nullishValues.forEach((value) => {
      const input = () => value;
      const expected = createExpected(defaultValue);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve using input function', () => {
    const cases: Array<{ input: FunctionOption<K, V>; expected: Resolved<K, V | D> }> = [
      { input: (key) => key === 'chrome' ? false : 'auto', expected: createExpected('auto', ['chrome'], false) },
      { input: (key) => key === 'deno' || key === 'node' ? true : 'auto', expected: createExpected('auto', ['node', 'deno'], true) },
    ];
    cases.forEach(({ input, expected }) => {
      expect(resolve(input)).toEqual(expected);
    });
  });

});
