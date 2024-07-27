import { createObjectResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createObjectResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;
  type V = string | boolean;

  const special: Record<S, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is V => ['string', 'boolean'].includes(typeof value);
  const defaultValue = 'default-value';

  const resolveRegular = createObjectResolver(
    keys,
    isValidValue,
    defaultValue,
    'override',
  );

  const resolveSpecial = createObjectResolver(
    keys,
    isValidValue,
    defaultValue,
    'override',
    special,
  );

  const createExpected = createExpectedCreator<K, V>((value) => {
    return {
      a: value,
      b: value,
      c: value,
      d: value,
    };
  });

  const validValues: V[] = [
    true,
    false,
    '',
    'string',
  ];

  test('Should throw on invalid key', () => {
    expect(() => resolveSpecial({ invalid: true })).toThrow();
  });

  test('Should return undefined on non object', () => {
    expect(resolveSpecial(10)).toBeUndefined();
    expect(resolveSpecial([])).toBeUndefined();
  });

  test('Should throw on invalid default value', () => {
    expect(() => resolveSpecial({ override: [] })).toThrow();
    expect(() => resolveSpecial({ override: 10 })).toThrow();
  });

  test('Should throw on invalid key value', () => {
    expect(() => resolveSpecial({ a: [] })).toThrow();
    expect(() => resolveSpecial({ c: 10 })).toThrow();
  });

  test('Should throw on invalid special key value', () => {
    expect(() => resolveSpecial({ first: [] })).toThrow();
    expect(() => resolveSpecial({ first: 10 })).toThrow();
  });

  test('Should throw on special key value if no special declared', () => {
    specialKeys.forEach((specialKey) => {
      validValues.forEach((value) => {
        const input = { [specialKey]: value };
        expect(() => resolveSpecial(input)).not.toThrow();
        expect(() => resolveRegular(input)).toThrow();
      });
    });
  });

  test('Should resolve to default if input is an empty object', () => {
    const expected = createExpected(defaultValue);
    expect(resolveSpecial({})).toEqual(expected);
  });

  test('Should ignore nullish values', () => {
    const nullish = [
      null,
      undefined,
    ];
    const validKeys = [
      'override',
      ...keys,
      ...specialKeys,
    ];
    const expected = createExpected(defaultValue);
    validKeys.forEach((key) => {
      nullish.forEach((value) => {
        expect(resolveSpecial({ [key]: value })).toEqual(expected);
      });
    });

  });

  test('Should override default value', () => {
    validValues.forEach((newDefaultValue) => {
      const expected = createExpected(newDefaultValue);
      expect(resolveSpecial({ override: newDefaultValue })).toEqual(expected);
    });
  });

  test('Should set simple keys', () => {
    const inputs = [
      { a: true, c: false, d: 'string' },
    ];
    inputs.forEach((input) => {
      const expected = {
        ...createExpected(defaultValue),
        ...input,
      };
      expect(resolveSpecial(input)).toEqual(expected);
    });
  });

  test('Should set special keys', () => {
    specialKeys.forEach((specialKey) => {
      validValues.forEach((value) => {
        const expected = createExpected(
          defaultValue,
          special[specialKey],
          value,
        );
        expect(resolveSpecial({ [specialKey]: value })).toEqual(expected);
      });
    });
  });

  test('Should set default and simple keys', () => {
    keys.forEach((key) => {
      const newDefaultValue = 'new-default-value';
      validValues.forEach((value) => {
        const expected = {
          ...createExpected(newDefaultValue),
          [key]: value,
        };
        expect(resolveSpecial({ override: newDefaultValue, [key]: value })).toEqual(expected);
      });
    });
  });

  test('Should set default and special keys', () => {

    specialKeys.forEach((specialKey) => {
      const newDefaultValue = 'new-default-value';
      validValues.forEach((value) => {
        const expected = special[specialKey].reduce((output, key) => {
          return { ...output, [key]: value };
        }, createExpected(newDefaultValue));
        expect(resolveSpecial({ override: newDefaultValue, [specialKey]: value })).toEqual(expected);
      });
    });
  });

  test('Should allow regular keys to override special keys', () => {
    specialKeys.forEach((specialKey) => {
      const specialResolved = special[specialKey];
      keys.forEach((key) => {
        validValues.forEach((specialValue, i) => {
          const value = validValues[(i + 1) % validValues.length];
          const expected = {
            ...createExpected(
              defaultValue,
              specialResolved,
              specialValue,
            ),
            [key]: value,
          };
          const input = { [specialKey]: specialValue, [key]: value };
          expect(resolveSpecial(input)).toEqual(expected);
        });
      });
    });

  });

});
