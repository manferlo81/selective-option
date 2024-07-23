import { resolveObject } from '../../src';

describe('deprecated resolveObject function', () => {

  type K = 'a' | 'b' | 'c' | 'd';
  type V = string | boolean;

  const keys: K[] = ['a', 'b', 'c', 'd'];
  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<string, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is V => ['string', 'boolean'].includes(typeof value);
  const defaultValue = 'default-value';

  const resolve = (value: unknown) => resolveObject(
    value,
    keys,
    isKey,
    special,
    isValidValue,
    defaultValue,
  );

  test('Should throw on invalid key', () => {
    expect(() => resolve({ invalid: true })).toThrow();
  });

  test('Should return undefined on non object', () => {
    expect(resolve(10)).toBeUndefined();
    expect(resolve([])).toBeUndefined();
  });

  test('Should throw on invalid default value', () => {
    expect(() => resolve({ default: [] })).toThrow();
    expect(() => resolve({ default: 10 })).toThrow();
  });

  test('Should throw on invalid key value', () => {
    expect(() => resolve({ a: [] })).toThrow();
    expect(() => resolve({ c: 10 })).toThrow();
  });

  test('Should throw on invalid special key value', () => {
    expect(() => resolve({ first: [] })).toThrow();
    expect(() => resolve({ first: 10 })).toThrow();
  });

  test('Should resolve to default', () => {
    expect(resolve({})).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should ignore nullish values', () => {
    expect(resolve({ default: null })).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
    expect(resolve({ a: null, c: null })).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
    expect(resolve({ first: null })).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should override default value', () => {
    const newDefaultValue = 'new-default-value';
    expect(resolve({ default: newDefaultValue })).toEqual({
      a: newDefaultValue,
      b: newDefaultValue,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

  test('Should set simple keys', () => {
    const a = true;
    const c = false;
    const d = 'string';
    expect(resolve({ a, c, d })).toEqual({
      a,
      b: defaultValue,
      c,
      d,
    });
  });

  test('Should set special keys', () => {
    expect(resolve({ last: true })).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: true,
      d: true,
    });
  });

  test('Should set default and simple keys', () => {
    const newDefaultValue = 'new-default-value';
    expect(resolve({ default: newDefaultValue, a: true, c: false })).toEqual({
      a: true,
      b: newDefaultValue,
      c: false,
      d: newDefaultValue,
    });
  });

  test('Should set default and special keys', () => {
    const newDefaultValue = 'new-default-value';
    expect(resolve({ default: newDefaultValue, first: true })).toEqual({
      a: true,
      b: true,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

  test('Should allow regular keys to override special keys', () => {
    expect(resolve({ b: false, first: true })).toEqual({
      a: true,
      b: false,
      c: defaultValue,
      d: defaultValue,
    });
  });

});
