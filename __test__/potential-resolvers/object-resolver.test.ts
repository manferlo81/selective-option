import { createObjectResolver, ObjectOption, Resolved } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';
import { ArrayItemType } from '../tools/helper-types';

describe('createObjectResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const;
  const specialKeys = ['server', 'browser'] as const;

  type K = ArrayItemType<typeof keys>;
  type S = ArrayItemType<typeof specialKeys>;
  type V = string | boolean;

  const special: Record<S, K[]> = { server: ['node', 'deno'], browser: ['chrome', 'firefox'] };

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

  const createExpected = createExpectedCreator<K, V>((value) => ({
    node: value,
    deno: value,
    chrome: value,
    firefox: value,
  }));

  const validValues: V[] = [
    true,
    false,
    '',
    'string',
  ];

  const invalidValues = [
    10,
    [],
  ];

  test('Should not resolve if input if not an object', () => {
    const nonObjectInputs = [
      10,
      [],
    ];
    nonObjectInputs.forEach((input) => {
      expect(resolveSpecial(input)).toBeUndefined();
    });
  });

  test('Should throw on invalid key', () => {
    const invalidKeys = [
      'invalid',
      'nodes',
      'dino',
      'chromr',
      'finefox',
    ];
    invalidKeys.forEach((invalidKey) => {
      const exec = () => resolveSpecial({ [invalidKey]: true });
      expect(exec).toThrow();
    });
  });

  test('Should throw on invalid override value', () => {
    invalidValues.forEach((value) => {
      const exec = () => resolveSpecial({ override: value });
      expect(exec).toThrow();
    });
  });

  test('Should throw on invalid key value', () => {
    invalidValues.forEach((invalidValue) => {
      keys.forEach((key) => {
        const exec = () => resolveSpecial({ [key]: invalidValue });
        expect(exec).toThrow();
      });
    });
  });

  test('Should throw on invalid special key value', () => {
    invalidValues.forEach((invalidValue) => {
      specialKeys.forEach((specialKey) => {
        const exec = () => resolveSpecial({ [specialKey]: invalidValue });
        expect(exec).toThrow();
      });
    });
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

  test('Should set regular keys', () => {
    keys.forEach((key) => {
      validValues.forEach((value) => {
        const expected = createExpected(
          defaultValue,
          [key],
          value,
        );
        expect(resolveSpecial({ [key]: value })).toEqual(expected);
      });
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

  test('Should set default and regular keys', () => {
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

  test('Should resolve advanced object options cases', () => {
    const cases: Array<{ input: ObjectOption<K | S | 'override', V>; expected: Resolved<K, V> }> = [
      { input: { override: 'override-value', deno: 'deno-value' }, expected: createExpected('override-value', ['deno'], 'deno-value') },
      { input: { deno: 'deno-value', override: 'override-value' }, expected: createExpected('override-value', ['deno'], 'deno-value') },
      { input: { deno: 'deno-value', server: 'server-value' }, expected: { ...createExpected(defaultValue, ['node', 'deno'], 'server-value'), deno: 'deno-value' } },
    ];
    cases.forEach(({ input, expected }) => {
      expect(resolveSpecial(input)).toEqual(expected);
    });
  });

});
