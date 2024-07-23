import { resolveFailed } from '../src';

describe('resolveFailed function', () => {

  test('Should always throw', () => {
    const inputs = [
      null,
      'string',
    ];
    inputs.forEach((input) => {
      const resolve = () => resolveFailed(input);
      expect(resolve).toThrow('is not a valid value');
    });
  });

  test('Should throw without quotes if it\'s not a string', () => {
    const nonStrings = [
      null,
      0,
      1,
      NaN,
    ];
    nonStrings.forEach((input) => {
      const resolve = () => resolveFailed(input);
      expect(resolve).toThrow(`${input} is not a valid value`);
    });
  });

  test('Should throw with quotes if it\'s a string', () => {
    const strings = [
      '',
      'string',
    ];
    strings.forEach((input) => {
      const resolve = () => resolveFailed(input);
      expect(resolve).toThrow(`"${input}" is not a valid value`);
    });
  });

});
