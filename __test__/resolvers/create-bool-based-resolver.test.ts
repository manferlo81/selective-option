import type { ObjectOption, ValueBasedSelectiveOption } from '../../src';
import { createBoolBasedResolver } from '../../src';
import { createExpectedCreator } from '../tools/create-expected';

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

  const special: Readonly<Record<SpecialKey, RegularKey[]>> = {
    male: ['john', 'peter'],
    female: ['gloria', 'maggie'],
    specified: ['gloria', 'john', 'maggie', 'peter'],
    unspecified: ['angel', 'ariel'],
  };

  const isValidValue = (value: unknown): value is LiteralValue => literalValues.includes(value as never);
  const defaultValue: BoolBaseValue = true;

  const resolveIsMarried = createBoolBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    overrideKey,
    special,
  );

  const resolveIsMarriedBoolOnly = createBoolBasedResolver(
    keys,
    null,
    defaultValue,
    overrideKey,
    special,
  );

  const createExpected = createExpectedCreator<RegularKey, BoolBaseValue>((initial) => {
    return {
      john: initial,
      angel: initial,
      ariel: initial,
      maggie: initial,
      peter: initial,
      gloria: initial,
    };
  });

  test('Should throw on invalid value', () => {
    const invalid = [
      'string',
    ];
    invalid.forEach((input) => {
      expect(() => resolveIsMarried(input as never)).toThrow();
      expect(() => resolveIsMarriedBoolOnly(input as never)).toThrow();
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
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);
    });
  });

  test('Should resolve valid literal value', () => {
    literalValues.forEach((input) => {
      const expected = createExpected(input);
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(() => resolveIsMarriedBoolOnly(input as never)).toThrow();
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
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);
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
      expect(resolveIsMarriedBoolOnly(key)).toEqual(expected);
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
      expect(resolveIsMarriedBoolOnly(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve array', () => {
    const expected = createExpected(false);
    expect(resolveIsMarried([])).toEqual(expected);
    expect(resolveIsMarriedBoolOnly([])).toEqual(expected);
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
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);

      const reversed = [...input].reverse();
      expect(resolveIsMarried(reversed)).toEqual(expected);
      expect(resolveIsMarriedBoolOnly(reversed)).toEqual(expected);

    });

  });

  test('Should resolve array of special keys', () => {

    interface InputItem {
      input: readonly SpecialKey[];
      changed: readonly RegularKey[];
    }

    const inputs = specialKeys.map<InputItem>((specialKey, i) => {
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
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);

      const reversed = [...input].reverse();
      expect(resolveIsMarried(reversed)).toEqual(expected);
      expect(resolveIsMarriedBoolOnly(reversed)).toEqual(expected);

    });

  });

  test('Should resolve array of mixed keys', () => {

    interface ItemType {
      input: ReadonlyArray<RegularKey | SpecialKey>;
      changed: readonly RegularKey[];
    }

    const inputs = specialKeys.reduce<ItemType[]>((list, specialKey) => {
      const objects = keys.map((key) => {
        const input = [specialKey, key] as const;
        const changed = [key, ...special[specialKey]];
        return { input, changed };
      });
      return [...list, ...objects];
    }, []);

    inputs.forEach(({ input, changed }) => {

      const expected = createExpected(
        false,
        changed,
        true,
      );

      expect(resolveIsMarried(input)).toEqual(expected);
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);

      const reversed = [...input].reverse();
      expect(resolveIsMarried(reversed)).toEqual(expected);
      expect(resolveIsMarriedBoolOnly(reversed)).toEqual(expected);

    });

  });

  test('Should resolve object', () => {
    const expected = createExpected(defaultValue);
    expect(resolveIsMarried({})).toEqual(expected);
    expect(resolveIsMarriedBoolOnly({})).toEqual(expected);
  });

  test('Should resolve object with overridden value', () => {
    literalValues.forEach((overrideValue) => {
      const input = { override: overrideValue };
      const expected = createExpected(overrideValue);
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(() => resolveIsMarriedBoolOnly(input as never)).toThrow();
    });
  });

  test('Should resolve object with overridden value', () => {
    [true, false].forEach((overrideValue) => {
      const expected = createExpected(overrideValue);
      const input = { override: overrideValue };
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(resolveIsMarriedBoolOnly(input)).toEqual(expected);
    });
  });

  test('Should resolve keys after override', () => {

    const inputs: Array<{ input: ObjectOption<RegularKey | SpecialKey | OverrideKey, LiteralValue>; override: LiteralValue; expected: Partial<Record<RegularKey, BoolBaseValue>> }> = [
      { input: { john: 'no' }, override: 'yes', expected: { john: 'no' } },
      { input: { male: 'yes' }, override: 'no', expected: { john: 'yes', peter: 'yes' } },
    ];

    inputs.forEach(({ input: partialInput, override, expected: extendedResult }) => {
      const defaultResult = createExpected(override);
      const expected = { ...defaultResult, ...extendedResult };
      const input = { ...partialInput, override };
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(() => resolveIsMarriedBoolOnly(input as never)).toThrow();
    });

  });

  test('Should resolve key over special key no matter the order', () => {

    const defaultResult = createExpected(defaultValue);

    const inputs: Array<{ input: ValueBasedSelectiveOption<RegularKey | SpecialKey | OverrideKey, BoolBaseValue>; expected: Partial<Record<RegularKey, BoolBaseValue>> }> = [
      { input: { male: 'yes', john: 'no' }, expected: { john: 'no', peter: 'yes' } },
      { input: { john: 'no', specified: false }, expected: { john: 'no', peter: false, gloria: false, maggie: false } },
    ];

    inputs.forEach(({ input, expected: extendedResult }) => {
      const expected = { ...defaultResult, ...extendedResult };
      expect(resolveIsMarried(input)).toEqual(expected);
      expect(() => resolveIsMarriedBoolOnly(input as never)).toThrow();
    });

  });

});
