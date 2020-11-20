import { resolveFailed } from '../src';

describe('Resolve Failed', () => {

  test('Should always throw', () => {
    expect(() => resolveFailed(null)).toThrow(/^null/);
    expect(() => resolveFailed('string')).toThrow(/^"string"/);
  });

});
