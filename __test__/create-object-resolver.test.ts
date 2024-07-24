import { createKeyResolver, createObjectResolver, createSpecialKeyResolver } from '../src';

describe('createObjectResolver function', () => {

  const keys = ['a', 'b', 'c', 'd'] as const;

  type K = (typeof keys)[number];
  type V = string | boolean;

  const isKey = (value: unknown): value is K => keys.includes(value as never);

  const special: Record<string, K[]> = { first: ['a', 'b'], last: ['c', 'd'] };

  const isValidValue = (value: unknown): value is V => ['string', 'boolean'].includes(typeof value);
  const defaultValue = 'default-value';

  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);

  test('Should throw on invalid key', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(() => resolve({ invalid: true })).toThrow();
  });

  test('Should return undefined on non object', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(resolve(10)).toBeUndefined();
    expect(resolve([])).toBeUndefined();
  });

  test('Should throw on invalid default value', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(() => resolve({ override: [] })).toThrow();
    expect(() => resolve({ override: 10 })).toThrow();
  });

  test('Should throw on invalid key value', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(() => resolve({ a: [] })).toThrow();
    expect(() => resolve({ c: 10 })).toThrow();
  });

  test('Should throw on invalid special key value', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(() => resolve({ first: [] })).toThrow();
    expect(() => resolve({ first: 10 })).toThrow();
  });

  test('Should resolve to default', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(resolve({})).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: defaultValue,
      d: defaultValue,
    });
  });

  test('Should ignore nullish values', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(resolve({ override: null })).toEqual({
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
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    const newDefaultValue = 'new-default-value';
    expect(resolve({ override: newDefaultValue })).toEqual({
      a: newDefaultValue,
      b: newDefaultValue,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

  test('Should use "default" as override key', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
    );
    const newDefaultValue = 'new-default-value';
    expect(resolve({ default: newDefaultValue })).toEqual({
      a: newDefaultValue,
      b: newDefaultValue,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

  test('Should set simple keys', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
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
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(resolve({ last: true })).toEqual({
      a: defaultValue,
      b: defaultValue,
      c: true,
      d: true,
    });
  });

  test('Should set default and simple keys', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    const newDefaultValue = 'new-default-value';
    expect(resolve({ override: newDefaultValue, a: true, c: false })).toEqual({
      a: true,
      b: newDefaultValue,
      c: false,
      d: newDefaultValue,
    });
  });

  test('Should set default and special keys', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    const newDefaultValue = 'new-default-value';
    expect(resolve({ override: newDefaultValue, first: true })).toEqual({
      a: true,
      b: true,
      c: newDefaultValue,
      d: newDefaultValue,
    });
  });

  test('Should allow regular keys to override special keys', () => {
    const resolve = createObjectResolver(
      keys,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      'override',
    );
    expect(resolve({ b: false, first: true })).toEqual({
      a: true,
      b: false,
      c: defaultValue,
      d: defaultValue,
    });
  });

});
