import type { AllowNullish, TypeCheckFunction } from '../private-types';
import { createResolver } from './create-resolver';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import type { KeyList, SpecialKeys, ValueBasedResolver } from './types';
import { createValueResolver } from './value';

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): ValueBasedResolver<K, S, V, O> {

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, overrideKey, special);

  // return compiled resolver
  return createResolver(
    resolveValue,
    resolveNullish,
    resolveObject,
  );

}
