import { ObjectOption, ValueBasedSelectiveOption } from '../src';
import type { K, S, V } from './tools/shape-size';
import { createResult, defaultValue, extendResult, keys, resolveShapeSize, special, specialKeys } from './tools/shape-size';

describe('createBoolBasedResolver function', () => {

  test('Should throw on invalid value', () => {
    expect(() => resolveShapeSize('string' as never)).toThrow();
  });

  test('Should resolve nullish value', () => {
    const inputs = [
      null,
      undefined,
    ];
    inputs.forEach((input) => {
      const expected = createResult(defaultValue);
      expect(resolveShapeSize(input)).toEqual(expected);
    });
  });

  test('Should resolve valid value', () => {
    const inputs: V[] = [
      10,
      0,
      1,
      NaN,
      'small',
      'random',
    ];
    inputs.forEach((input) => {
      const expected = createResult(input);
      expect(resolveShapeSize(input)).toEqual(expected);
    });
  });

  test('Should resolve boolean value', () => {
    const inputs = [
      true,
      false,
    ];
    inputs.forEach((input) => {
      const expected = createResult(input);
      expect(resolveShapeSize(input)).toEqual(expected);
    });
  });

  test('Should resolve key', () => {
    const falseResult = createResult(false);
    keys.forEach((key) => {
      const expected = {
        ...falseResult,
        [key]: true,
      };
      expect(resolveShapeSize(key)).toEqual(expected);
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
      expect(resolveShapeSize(specialKey)).toEqual(expected);
    });
  });

  test('Should resolve array', () => {
    expect(resolveShapeSize([])).toEqual(createResult(false));
  });

  test('Should resolve array of keys', () => {
    const falseResult = createResult(false);
    const inputs: K[][] = [
      [],
      ['circle', 'rectangle'],
    ];
    inputs.forEach((input) => {
      const expected = extendResult(
        falseResult,
        input,
        true,
      );
      expect(resolveShapeSize(input)).toEqual(expected);
    });
  });

  test('Should resolve array of special keys', () => {
    const falseResult = createResult(false);
    const inputs: Array<{ input: readonly S[]; changed: readonly K[] }> = [
      { input: [], changed: [] },
      { input: ['elliptical'], changed: ['circle', 'oval'] },
      { input: ['quadrilateral'], changed: ['rectangle', 'square'] },
      { input: specialKeys, changed: keys },
    ];
    inputs.forEach(({ input, changed }) => {
      const expected = extendResult(
        falseResult,
        changed,
        true,
      );
      expect(resolveShapeSize(input)).toEqual(expected);
    });
  });

  test('Should resolve array of mixed keys', () => {
    const falseResult = createResult(false);
    const inputs: Array<{ input: Array<K | S>; changed: readonly K[] }> = [
      { input: ['elliptical', 'square'], changed: ['circle', 'oval', 'square'] },
      { input: ['quadrilateral', 'oval'], changed: ['oval', 'rectangle', 'square'] },
      { input: ['quadrilateral', 'square'], changed: ['rectangle', 'square'] },
      { input: ['quadrilateral', 'rectangle'], changed: ['rectangle', 'square'] },
      { input: ['elliptical', 'circle'], changed: ['circle', 'oval'] },
      { input: ['elliptical', 'oval'], changed: ['circle', 'oval'] },
    ];
    inputs.forEach(({ input, changed }) => {
      const expected = extendResult(
        falseResult,
        changed,
        true,
      );
      expect(resolveShapeSize(input)).toEqual(expected);
      expect(resolveShapeSize(input.reverse())).toEqual(expected);
    });
  });

  test('Should resolve object', () => {
    const expected = createResult(defaultValue);
    expect(resolveShapeSize({})).toEqual(expected);
  });

  test('Should resolve object with overridden value', () => {
    const values: Array<V | boolean> = [
      99,
      40,
      true,
      false,
      'small',
      'random',
    ];
    values.forEach((overrideValue) => {
      const expected = createResult(overrideValue);
      expect(resolveShapeSize({ override: overrideValue })).toEqual(expected);
    });
  });

  test('Should resolve keys after override', () => {
    const inputs: Array<{ input: ObjectOption<K | S, V, 'override'>; override: V; expected: Partial<Record<K, V | boolean>> }> = [
      { input: { oval: 40 }, override: 'small', expected: { oval: 40 } },
      { input: { quadrilateral: 40 }, override: 'small', expected: { rectangle: 40, square: 40 } },
    ];
    inputs.forEach(({ input, override, expected: extendedResult }) => {
      const defaultResult = createResult(override);
      expect(resolveShapeSize({ ...input, override })).toEqual({ ...defaultResult, ...extendedResult });
    });
  });

  test('Should resolve key over special key no matter the order', () => {
    const defaultResult = createResult(defaultValue);
    const inputs: Array<{ input: ValueBasedSelectiveOption<K | S, V, 'override'>; expected: Partial<Record<K, V | boolean>> }> = [
      { input: { quadrilateral: 20, square: 10 }, expected: { square: 10, rectangle: 20 } },
      { input: { square: 10, quadrilateral: 20 }, expected: { square: 10, rectangle: 20 } },
    ];
    inputs.forEach(({ input, expected: extendedResult }) => {
      expect(resolveShapeSize(input)).toEqual({ ...defaultResult, ...extendedResult });
    });
  });

});
