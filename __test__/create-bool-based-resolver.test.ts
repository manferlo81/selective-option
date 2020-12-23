import { createBoolBasedResolver } from '../src';

describe('Resolve Bool Based', () => {

  type K = 'a' | 'b' | 'c' | 'd';
  type T = number;

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<string, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is T => typeof value === 'number';
  const defaultValue = 0;

  const resolve = createBoolBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  );

  test('Should throw on invalid value', () => {
    expect(() => resolve('string')).toThrow();
  });

  test('Should resolve null value', () => {
    expect(resolve(null)).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
    expect(resolve(undefined)).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should resolve valid value', () => {
    expect(resolve(10)).toEqual({
      a: 10,
      b: 10,
      c: 10,
      d: 10,
    });
    expect(resolve(NaN)).toEqual({
      a: NaN,
      b: NaN,
      c: NaN,
      d: NaN,
    });
  });

  test('Should resolve boolean value', () => {
    expect(resolve(true)).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
    });
    expect(resolve(false)).toEqual({
      a: false,
      b: false,
      c: false,
      d: false,
    });
  });

  test('Should resolve key', () => {
    expect(resolve('b')).toEqual({
      a: false,
      b: true,
      c: false,
      d: false,
    });
    expect(resolve('d')).toEqual({
      a: false,
      b: false,
      c: false,
      d: true,
    });
  });

  test('Should resolve special key', () => {
    expect(resolve('first')).toEqual({
      a: true,
      b: true,
      c: false,
      d: false,
    });
    expect(resolve('last')).toEqual({
      a: false,
      b: false,
      c: true,
      d: true,
    });
  });

  test('Should resolve array', () => {
    expect(resolve([])).toEqual({
      a: false,
      b: false,
      c: false,
      d: false,
    });
  });

  test('Should resolve array of keys', () => {
    expect(resolve(['a', 'd'])).toEqual({
      a: true,
      b: false,
      c: false,
      d: true,
    });
  });

  test('Should resolve array of special keys', () => {
    expect(resolve(['first'])).toEqual({
      a: true,
      b: true,
      c: false,
      d: false,
    });
    expect(resolve(['last'])).toEqual({
      a: false,
      b: false,
      c: true,
      d: true,
    });
  });

  test('Should resolve array of mixed keys', () => {
    expect(resolve(['first', 'd'])).toEqual({
      a: true,
      b: true,
      c: false,
      d: true,
    });
  });

  test('Should resolve object', () => {
    expect(resolve({})).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should resolve object with default value', () => {
    const newDefaultValue = 99;
    expect(resolve({ default: newDefaultValue })).toEqual({
      a: newDefaultValue,
      b: newDefaultValue,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

});
