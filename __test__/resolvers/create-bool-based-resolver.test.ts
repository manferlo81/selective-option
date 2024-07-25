import { createBoolBasedResolver, KeyList, ObjectOption, ValueBasedSelectiveOption } from '../../src';

describe('createBoolBasedResolver function', () => {

  const keys = ['john', 'maggie', 'angel', 'ariel', 'peter', 'gloria'] as const;
  const literalValues = ['yes', 'no', 'unknown'] as const;
  const specialKeys = ['male', 'female', 'specified', 'unspecified'] as const;
  const overrideKey = 'override';

  type RegularKey = (typeof keys)[number];
  type SpecialKey = (typeof specialKeys)[number];
  type LiteralValue = (typeof literalValues)[number];
  type BoolBaseValue = LiteralValue | boolean;
  type OverrideKey = typeof overrideKey;
  type Expected<V> = Readonly<Record<RegularKey, V>>;

  const special: Readonly<Record<SpecialKey, RegularKey[]>> = {
    male: ['john', 'peter'],
    female: ['gloria', 'maggie'],
    specified: ['gloria', 'john', 'maggie', 'peter'],
    unspecified: ['angel', 'ariel'],
  };

  const isValidValue = (value: unknown): value is LiteralValue => literalValues.includes(value as never);
  const defaultValue: BoolBaseValue = 'unknown';

  const resolveIsMarried = createBoolBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    overrideKey,
    special,
  );

  const createExpected = <V extends BoolBaseValue>(initial: V, keys?: KeyList<RegularKey>, value2?: V): Expected<V | undefined> => {
    const expected: Expected<V> = {
      john: initial,
      angel: initial,
      ariel: initial,
      maggie: initial,
      peter: initial,
      gloria: initial,
    };
    if (!keys) return expected;
    return keys.reduce((output, key) => {
      return { ...output, [key]: value2 };
    }, expected);
  };

  const validValues: readonly BoolBaseValue[] = [
    ...literalValues,
    true,
    false,
  ];

  test('Should throw on invalid value', () => {
    const invalid = [
      'string',
    ];
    invalid.forEach((input) => {
      expect(() => resolveIsMarried(input as never)).toThrow();
    });
  });

  test('Should resolve nullish value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      const expected = createExpected(defaultValue);
      expect(resolveIsMarried(input)).toEqual(expected);
    });
  });

  test('Should resolve valid value', () => {
    literalValues.forEach((input) => {
      const expected = createExpected(input);
      expect(resolveIsMarried(input)).toEqual(expected);
    });
  });

  test('Should resolve boolean value', () => {
    const inputs = [
      true,
      false,
    ];
    inputs.forEach((input) => {
      const expected = createExpected(input);
      expect(resolveIsMarried(input)).toEqual(expected);
    });
  });

  test('Should resolve key', () => {
    const falseResult = createExpected(false);
    keys.forEach((key) => {
      const expected = {
        ...falseResult,
        [key]: true,
      };
      expect(resolveIsMarried(key)).toEqual(expected);
    });
  });

  test('Should resolve special key', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(
        false,
        special[specialKey],
        true,
      );
      expect(resolveIsMarried(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve array', () => {
    const expected = createExpected(false);
    expect(resolveIsMarried([])).toEqual(expected);
  });

  test('Should resolve array of keys', () => {

    const inputs: Array<readonly RegularKey[]> = keys.map((key, i) => {
      const other = keys[(i + 1) % keys.length];
      const other2 = keys[(i + 2) % keys.length];
      return [key, other, other2];
    });

    inputs.forEach((input) => {
      const expected = createExpected(
        false,
        input,
        true,
      );
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(resolveIsMarried(input.toReversed())).toEqual(expected);
    });

  });

  test('Should resolve array of special keys', () => {

    const inputs = specialKeys.map<{ input: readonly SpecialKey[]; changed: readonly RegularKey[] }>((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length];
      const input = [specialKey, otherKey];
      const changed = [...special[specialKey], ...special[otherKey]];
      return { input, changed };
    });

    inputs.forEach(({ input, changed }) => {
      const expected = createExpected(
        false,
        changed,
        true,
      );
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(resolveIsMarried(input.toReversed())).toEqual(expected);
    });

  });

  test('Should resolve array of mixed keys', () => {

    const inputs = specialKeys.reduce((list, specialKey) => {
      const l = keys.map((key) => {
        const input = [specialKey, key] as const;
        const changed = [key, ...special[specialKey]];
        return { input, changed };
      });
      return [...list, ...l];
    }, [] as Array<{ input: ReadonlyArray<RegularKey | SpecialKey>; changed: readonly RegularKey[] }>);

    inputs.forEach(({ input, changed }) => {
      const expected = createExpected(
        false,
        changed,
        true,
      );
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(resolveIsMarried(input.toReversed())).toEqual(expected);
    });

  });

  test('Should resolve object', () => {
    const expected = createExpected(defaultValue);
    expect(resolveIsMarried({})).toEqual(expected);
  });

  test('Should resolve object with overridden value', () => {
    validValues.forEach((overrideValue) => {
      const expected = createExpected(overrideValue);
      expect(resolveIsMarried({ override: overrideValue })).toEqual(expected);
    });
  });

  test('Should resolve keys after override', () => {

    const inputs: Array<{ input: ObjectOption<RegularKey | SpecialKey, LiteralValue, OverrideKey>; override: LiteralValue; expected: Partial<Expected<BoolBaseValue>> }> = [
      { input: { john: 'no' }, override: 'yes', expected: { john: 'no' } },
      { input: { male: 'yes' }, override: 'no', expected: { john: 'yes', peter: 'yes' } },
    ];

    inputs.forEach(({ input, override, expected: extendedResult }) => {
      const defaultResult = createExpected(override);
      expect(resolveIsMarried({ ...input, override })).toEqual({ ...defaultResult, ...extendedResult });
    });

  });

  test('Should resolve key over special key no matter the order', () => {

    const defaultResult = createExpected(defaultValue);

    const inputs: Array<{ input: ValueBasedSelectiveOption<RegularKey | SpecialKey, BoolBaseValue, OverrideKey>; expected: Partial<Expected<BoolBaseValue>> }> = [
      { input: { male: 'yes', john: 'no' }, expected: { john: 'no', peter: 'yes' } },
      { input: { john: 'no', specified: false }, expected: { john: 'no', peter: false, gloria: false, maggie: false } },
    ];

    inputs.forEach(({ input, expected: extendedResult }) => {
      const expected = { ...defaultResult, ...extendedResult };
      expect(resolveIsMarried(input)).toEqual(expected);
    });

  });

});
