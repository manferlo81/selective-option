import { createResult } from '../src';

describe('Create Result', () => {

  test('Should create result correctly', () => {
    expect(createResult([], true)).toEqual({});
    expect(createResult(['a', 'b', 'c'], true)).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  test('Should create result with given value', () => {
    expect(createResult(['a', 'b', 'c'], 'given-value')).toEqual({
      a: 'given-value',
      b: 'given-value',
      c: 'given-value',
    });
  });

  test('Should create result extending given input', () => {
    const input = { a: 'A' };
    const result = createResult<string, boolean | string>(['b', 'c', 'd'], true, input);
    expect(result).toEqual({
      a: 'A',
      b: true,
      c: true,
      d: true,
    });
    expect(result).toBe(input);
  });

});
