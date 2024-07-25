import type { AllowNullish, TypeCheckFunction } from '../private-types';
import { createArrayResolver } from './array';
import { createResolver } from './create-resolver';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createStringResolver } from './string';
import type { BoolBasedResolver, KeyList, SpecialKeys } from './types';
import { createValueResolver } from './value';

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): BoolBasedResolver<K, S, V | boolean, O> {

  // create boolean value validator
  const isValueOrBool = (value: unknown): value is V | boolean => {
    return isValidValue(value) || value === true || value === false;
  };

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValueOrBool);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, special);
  const resolveArray = createArrayResolver(keys, special);
  const resolveObject = createObjectResolver(keys, isValueOrBool, defaultValue, overrideKey, special);

  // return compiled resolver
  return createResolver<K, V | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );

}
