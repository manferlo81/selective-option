import { createValueBasedResolver, Resolved } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';

describe('createValueBasedResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;
  const overrideKey = 'default';

  type RegularKey = (typeof keys)[number];
  type SpecialKey = (typeof specialKeys)[number];
  type ValidValue = number | null;

  const special: Record<SpecialKey, RegularKey[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is ValidValue => value === null || typeof value === 'number';
  const defaultValue: ValidValue = 0;

  const validValues: ValidValue[] = [
    null,
    0,
    1,
    100,
    -100,
    NaN,
    Infinity,
  ];

  const resolve = createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    overrideKey,
    special,
  );

  const createExpected = createExpectedCreator<RegularKey, ValidValue>((initial) => {
    return {
      a: initial,
      b: initial,
      c: initial,
      d: initial,
    };
  });

  const nullishValues = [
    // null, null is a valid value in this case and doesn't resolve to default value
    undefined,
  ];

  const invalidValues = [
    true,
  ];

  test('Should throw on invalid value', () => {
    invalidValues.forEach((input) => {
      const exec = () => resolve(input as never);
      expect(exec).toThrow();
    });
  });

  test('Should resolve nullish value', () => {
    nullishValues.forEach((input) => {
      const expected = createExpected(defaultValue);
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should resolve valid value', () => {
    validValues.forEach((input) => {
      const expected = createExpected(input);
      expect(resolve(input)).toEqual(expected);
    });
  });

  describe('input as a function', () => {

    test('Should throw if input function returns invalid value', () => {
      const input = () => true;
      expect(() => resolve(input as never)).toThrow();
    });

    test('Should resolve if input function returns nullish value', () => {
      nullishValues.forEach((value) => {
        const input = () => value;
        const expected = createExpected(defaultValue);
        expect(resolve(input)).toEqual(expected);
      });
    });

    test('Should resolve if input function returns valid value', () => {
      validValues.forEach((value) => {
        const input = () => value;
        const expected = createExpected(value);
        expect(resolve(input)).toEqual(expected);
      });
    });

    test('Should resolve using input function', () => {
      interface AdvancedFunctionTestEntry {
        input: (key: RegularKey) => ValidValue;
        expected: Resolved<RegularKey, ValidValue>;
      }
      const testCases: AdvancedFunctionTestEntry[] = [
        { input: (key) => key === 'c' ? 20 : 10, expected: createExpected(10, ['c'], 20) },
      ];
      testCases.forEach(({ input, expected }) => {
        expect(resolve(input)).toEqual(expected);
      });
    });

  });

  describe('input as an object', () => {

    test('Should resolve object', () => {
      const expected = createExpected(defaultValue);
      expect(resolve({})).toEqual(expected);
    });

    test('Should resolve object with default value', () => {
      validValues.forEach((newDefaultValue) => {
        const expected = createExpected(newDefaultValue);
        expect(resolve({ default: newDefaultValue })).toEqual(expected);
      });
    });

    test('Should resolve object with regular key value', () => {
      keys.forEach((key) => {
        validValues.forEach((input) => {
          const expected = {
            ...createExpected(defaultValue),
            [key]: input,
          };
          expect(resolve({ [key]: input })).toEqual(expected);
        });
      });
    });

    test('Should resolve object with special key value', () => {
      specialKeys.forEach((specialKey) => {
        validValues.forEach((input) => {
          const expected = special[specialKey].reduce((output, key) => {
            return { ...output, [key]: input };
          }, createExpected(defaultValue));
          expect(resolve({ [specialKey]: input })).toEqual(expected);
        });
      });
    });

    test('Should resolve valid value before nullish value', () => {
      expect(resolve({ default: null })).toEqual(createExpected(null));
      expect(resolve({ default: undefined })).toEqual(createExpected(defaultValue));
    });

  });

});
