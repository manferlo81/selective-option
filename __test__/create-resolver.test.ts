import type { PotentialResolver } from '../src';
import { createResolver, createResult } from '../src';

describe('', () => {

  const keys = ['john', 'maria', 'peter', 'richard'] as const;

  type K = (typeof keys)[number];

  const numberResolver: PotentialResolver<K, number> = (input) => {

    if (typeof input !== 'number') return;

    return createResult(
      keys,
      input,
    );

  };

  const literalNumbers = ['pi', 'e'] as const;
  type V = (typeof literalNumbers)[number];

  const literalNumberResolver: PotentialResolver<K, V> = (input) => {

    if (typeof input !== 'string') return;

    if (!literalNumbers.includes(input as never)) return;

    return createResult(
      keys,
      input as V,
    );

  };

  const resolveLuckyNumber = createResolver<K, V | number, V | number>(
    numberResolver,
    literalNumberResolver,
  );

  const createExpected = <V>(value: V): Record<K, V> => {
    return {
      john: value,
      maria: value,
      peter: value,
      richard: value,
    };
  };

  test('Should throw on invalid input', () => {

    const inputs = [
      '',
      'string',
      'number',
      true,
      false,
    ];

    inputs.forEach((input) => {
      expect(() => resolveLuckyNumber(input as never)).toThrow('is not a valid value');
    });

  });

  test('Should resolve number', () => {

    const numbers = [
      10,
      -5,
      NaN,
      Infinity,
      400,
      0,
      1,
    ];

    numbers.forEach((input) => {
      const expected = createExpected(input);
      expect(resolveLuckyNumber(input)).toEqual(expected);
    });

  });

  test('Should resolve literal number', () => {

    literalNumbers.forEach((input) => {
      const expected = createExpected(input);
      expect(resolveLuckyNumber(input)).toEqual(expected);
    });

  });

});
