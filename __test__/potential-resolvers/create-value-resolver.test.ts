import { createValueResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createValueResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const validValues = [true, false, 'auto'] as const;

  type K = ArrayItemType<typeof keys>;
  type V = boolean | 'auto';

  const isValidValue = (value: unknown): value is V => validValues.includes(value as never);

  const resolve = createValueResolver<K, V>(
    keys,
    isValidValue,
  );

  const createExpected = createExpectedCreator<K, V>((value) => ({
    a: value,
    b: value,
    c: value,
    d: value,
  }));

  test('Should resolve valid value', () => {
    validValues.forEach((input) => {
      expect(resolve(input)).toEqual(createExpected(input));
    });
  });

  test('Should resolve to undefined if not valid value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

});
