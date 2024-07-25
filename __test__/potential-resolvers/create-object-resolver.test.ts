import { createObjectResolver } from '../../src';

describe('createObjectResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;
  const specialKeys = ['first', 'last'] as const;

  type K = (typeof keys)[number];
  type S = (typeof specialKeys)[number];
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

  const resolve = createObjectResolver(
    keys,
    isValidValue,
    defaultValue,
    'override',
    special,
  );

  const createExpected = <V>(value: V, ...extend: Array<{ keys: readonly K[]; value: V }>): Record<K, V> => {
    const expected: Record<K, V> = {
      a: value,
      b: value,
      c: value,
      d: value,
    };
    return extend.reduce((output, { keys, value }) => {
      return keys.reduce((output, key) => {
        return { ...output, [key]: value };
      }, output);
    }, expected);
  };

  const validValues: V[] = [
    true,
    false,
    '',
    'string',
  ];

  test('Should throw on invalid key', () => {
    expect(() => resolve({ invalid: true })).toThrow();
  });

  test('Should return undefined on non object', () => {
    expect(resolve(10)).toBeUndefined();
    expect(resolve([])).toBeUndefined();
  });

  test('Should throw on invalid default value', () => {
    expect(() => resolve({ override: [] })).toThrow();
    expect(() => resolve({ override: 10 })).toThrow();
  });

  test('Should throw on invalid key value', () => {
    expect(() => resolve({ a: [] })).toThrow();
    expect(() => resolve({ c: 10 })).toThrow();
  });

  test('Should throw on invalid special key value', () => {
    expect(() => resolve({ first: [] })).toThrow();
    expect(() => resolve({ first: 10 })).toThrow();
  });

  test('Should throw on special key value if no special declared', () => {
    specialKeys.forEach((specialKey) => {
      validValues.forEach((value) => {
        const input = { [specialKey]: value };
        expect(() => resolve(input)).not.toThrow();
        expect(() => resolveRegular(input)).toThrow();
      });
    });
  });

  test('Should resolve to default if input is an empty object', () => {
    const expected = createExpected(defaultValue);
    expect(resolve({})).toEqual(expected);
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
        expect(resolve({ [key]: value })).toEqual(expected);
      });
    });

  });

  test('Should override default value', () => {
    validValues.forEach((newDefaultValue) => {
      const expected = createExpected(newDefaultValue);
      expect(resolve({ override: newDefaultValue })).toEqual(expected);
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
      expect(resolve(input)).toEqual(expected);
    });
  });

  test('Should set special keys', () => {
    specialKeys.forEach((specialKey) => {
      validValues.forEach((value) => {
        const expected = createExpected(
          defaultValue,
          { keys: special[specialKey], value },
        );
        expect(resolve({ [specialKey]: value })).toEqual(expected);
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
        expect(resolve({ override: newDefaultValue, [key]: value })).toEqual(expected);
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
        expect(resolve({ override: newDefaultValue, [specialKey]: value })).toEqual(expected);
      });
    });
  });

  test('Should allow regular keys to override special keys', () => {
    specialKeys.forEach((specialKey) => {
      keys.forEach((key) => {
        validValues.forEach((specialValue, i) => {
          const value = validValues[(i + 1) % validValues.length];
          const expected = {
            ...createExpected(
              defaultValue,
              { keys: special[specialKey], value: specialValue },
            ),
            [key]: value,
          };
          const input = { [specialKey]: specialValue, [key]: value };
          expect(resolve(input)).toEqual(expected);
        });
      });
    });

  });

});
