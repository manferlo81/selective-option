import { createFunctionResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import type { ArrayItemType } from '../tools/helper-types';

describe('createFunctionResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const validValues = [true, false, 'auto'] as const;

  type K = ArrayItemType<typeof keys>;
  type V = boolean | 'auto';

  const defaultValue: V = false;

  const isValidValue = (value: unknown): value is V => validValues.includes(value as never);

  const resolve = createFunctionResolver<K, V>(
    keys,
    isValidValue,
    defaultValue,
  );

  const createExpected = createExpectedCreator<K, V>((value) => ({
    a: value,
    b: value,
    c: value,
    d: value,
  }));

  test('Should not resolve if input is not a function', () => {
    const inputs = [
      [],
      {},
      0,
      1,
      '',
      'string',
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

  test('Should throw if input function returns invalid value', () => {
    const inputs = [
      [],
      {},
      0,
      1,
      '',
      'string',
    ];
    inputs.forEach((value) => {
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

});
