import { createNullishResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createNullishResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;

  type K = ArrayItemType<typeof keys>;
  type V = boolean | 'auto';

  const defaultValue = true;

  const resolve = createNullishResolver<K, V>(
    keys,
    defaultValue,
  );

  const createExpected = createExpectedCreator<K, V>((value) => ({
    a: value,
    b: value,
    c: value,
    d: value,
  }));

  test('Should resolve nullish value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      const expected = createExpected(defaultValue);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve to undefined if not nullish', () => {
    const inputs = [
      '',
      0,
      [],
      {},
    ];
    inputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined();
    });
  });

});
