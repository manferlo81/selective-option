import type { TypeCheckFunction } from '../types/private-types';
import type { KeyList, PotentialResolver, Resolved } from '../types/resolver-types';
import { is } from '../tools/is';
import { resolveValueOrNullish } from '../tools/value-nullish';
import { errorInvalidValue } from '../tools/errors';

export function createFunctionResolver<K extends string, V, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): PotentialResolver<K, V | D> {

  return (input) => {

    if (!is(input, 'function')) return;

    const getValue = (key: K) => {
      const value = input(key) as V;
      const valueResolved = resolveValueOrNullish(value, isValidValue);
      if (!valueResolved) throw errorInvalidValue(value);
      const [isValid, validatedValue] = valueResolved;
      if (!isValid) return defaultValue;
      return validatedValue;
    };

    return keys.reduce<Partial<Resolved<K, V>>>((output, key) => {
      const value = getValue(key);
      return { ...output, [key]: value };
    }, {}) as Resolved<K, V>;

  };

}
