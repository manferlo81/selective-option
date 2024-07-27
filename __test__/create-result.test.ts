import { createResult } from '../src';

describe('createResult function', () => {

  test('Should create result correctly', () => {
    const cases = [
      { keys: [], value: null, expected: {} },
      { keys: ['a', 'b', 'c'], value: true, expected: { a: true, b: true, c: true } },
    ];
    cases.forEach(({ keys, value, expected }) => {
      expect(createResult(keys, value)).toEqual(expected);
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
  });

});
