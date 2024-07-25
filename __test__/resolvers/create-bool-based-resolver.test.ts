import { createBoolBasedResolver, ObjectOption, ValueBasedSelectiveOption } from '../../src';

describe('createBoolBasedResolver function', () => {

  const keys = ['john', 'maggie', 'angel', 'ariel', 'peter', 'gloria'] as const;
  const literalSizeValues = ['low', 'high', 'unknown'] as const;

  type K = (typeof keys)[number];
  type S = 'male' | 'female' | 'unisex';
  type V = number | (typeof literalSizeValues)[number];
  type R<V> = Readonly<Record<K, V>>;

  const special: Record<S, K[]> = {
    male: ['angel', 'ariel', 'john', 'peter'],
    female: ['angel', 'ariel', 'gloria', 'maggie'],
    unisex: ['angel', 'ariel'],
  };
  const specialKeys = Object.keys(special) as readonly S[];

  const isValidSize = (value: unknown): value is V => typeof value === 'number' || literalSizeValues.includes(value as never);
  const defaultValue: V | boolean = 'unknown';

  const createResult = <X extends V | boolean>(value: X): R<X> => {
    return {
      john: value,
      angel: value,
      ariel: value,
      maggie: value,
      peter: value,
      gloria: value,
    };
  };

  function extendResult<I extends V | boolean, X extends V | boolean>(result: R<I>, keys: readonly K[], value: X): R<I | X> {
    return keys.reduce((output, key) => {
      return { ...output, [key]: value };
    }, result as R<I | X>);
  }

  const resolvePoints = createBoolBasedResolver(
    keys,
    isValidSize,
    defaultValue,
    'override',
    special,
  );

  test('Should throw on invalid value', () => {
    const invalid = [
      'string',
    ];
    invalid.forEach((input) => {
      expect(() => resolvePoints(input as never)).toThrow();
    });
  });

  test('Should resolve nullish value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      const expected = createResult(defaultValue);
      expect(resolvePoints(input)).toEqual(expected);
    });
  });

  test('Should resolve valid value', () => {
    const inputs: V[] = [
      10,
      0,
      1,
      NaN,
      'high',
      'low',
      'unknown',
    ];
    inputs.forEach((input) => {
      const expected = createResult(input);
      expect(resolvePoints(input)).toEqual(expected);
    });
  });

  test('Should resolve boolean value', () => {
    const inputs = [
      true,
      false,
    ];
    inputs.forEach((input) => {
      const expected = createResult(input);
      expect(resolvePoints(input)).toEqual(expected);
    });
  });

  test('Should resolve key', () => {
    const falseResult = createResult(false);
    keys.forEach((key) => {
      const expected = {
        ...falseResult,
        [key]: true,
      };
      expect(resolvePoints(key)).toEqual(expected);
    });
  });

  test('Should resolve special key', () => {
    const specialKeys = Object.keys(special) as S[];
    specialKeys.forEach((specialKey) => {
      const keys = special[specialKey];
      const expected = extendResult(
        createResult(false),
        keys,
        true,
      );
      expect(resolvePoints(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve array', () => {
    expect(resolvePoints([])).toEqual(createResult(false));
  });

  test('Should resolve array of keys', () => {
    const falseResult = createResult(false);
    const inputs: K[][] = [
      [],
      ['angel', 'maggie'],
      ['gloria', 'peter'],
    ];
    inputs.forEach((input) => {
      const expected = extendResult(
        falseResult,
        input,
        true,
      );
      expect(resolvePoints(input)).toEqual(expected);
    });
  });

  test('Should resolve array of special keys', () => {
    const falseResult = createResult(false);
    const inputs: Array<{ input: readonly S[]; changed: readonly K[] }> = [
      { input: [], changed: [] },
      { input: ['male'], changed: ['angel', 'ariel', 'john', 'peter'] },
      { input: ['female'], changed: ['angel', 'ariel', 'gloria', 'maggie'] },
      { input: specialKeys, changed: keys },
    ];
    inputs.forEach(({ input, changed }) => {
      const expected = extendResult(
        falseResult,
        changed,
        true,
      );
      expect(resolvePoints(input)).toEqual(expected);
    });
  });

  test('Should resolve array of mixed keys', () => {
    const falseResult = createResult(false);
    const inputs: Array<{ input: Array<K | S>; changed: readonly K[] }> = [
      { input: ['female', 'john'], changed: ['maggie', 'angel', 'ariel', 'gloria', 'john'] },
      { input: ['female', 'maggie'], changed: ['maggie', 'angel', 'ariel', 'gloria'] },
      { input: ['unisex', 'gloria'], changed: ['angel', 'ariel', 'gloria'] },
      { input: ['unisex', 'angel'], changed: ['angel', 'ariel'] },
    ];
    inputs.forEach(({ input, changed }) => {
      const expected = extendResult(
        falseResult,
        changed,
        true,
      );
      expect(resolvePoints(input)).toEqual(expected);
      expect(resolvePoints(input.reverse())).toEqual(expected);
    });
  });

  test('Should resolve object', () => {
    const expected = createResult(defaultValue);
    expect(resolvePoints({})).toEqual(expected);
  });

  test('Should resolve object with overridden value', () => {
    const values: Array<V | boolean> = [
      99,
      40,
      true,
      false,
      'high',
      'low',
      'unknown',
    ];
    values.forEach((overrideValue) => {
      const expected = createResult(overrideValue);
      expect(resolvePoints({ override: overrideValue })).toEqual(expected);
    });
  });

  test('Should resolve keys after override', () => {
    const inputs: Array<{ input: ObjectOption<K | S, V, 'override'>; override: V; expected: Partial<Record<K, V | boolean>> }> = [
      { input: { john: 40 }, override: 'low', expected: { john: 40 } },
      { input: { male: 40 }, override: 'low', expected: { angel: 40, ariel: 40, john: 40, peter: 40 } },
    ];
    inputs.forEach(({ input, override, expected: extendedResult }) => {
      const defaultResult = createResult(override);
      expect(resolvePoints({ ...input, override })).toEqual({ ...defaultResult, ...extendedResult });
    });
  });

  test('Should resolve key over special key no matter the order', () => {
    const defaultResult = createResult(defaultValue);
    const inputs: Array<{ input: ValueBasedSelectiveOption<K | S, V | boolean, 'override'>; expected: Partial<Record<K, V | boolean>> }> = [
      { input: { male: 20, john: 10 }, expected: { angel: 20, ariel: 20, john: 10, peter: 20 } },
      { input: { john: true, male: 20 }, expected: { angel: 20, ariel: 20, john: true, peter: 20 } },
    ];
    inputs.forEach(({ input, expected: extendedResult }) => {
      expect(resolvePoints(input)).toEqual({ ...defaultResult, ...extendedResult });
    });
  });

});
