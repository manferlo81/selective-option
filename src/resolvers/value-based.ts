import { createResolver } from '../create-resolver';
import type { AllowNullish, TypeCheckFunction } from '../private-types';
import { createNullishResolver } from '../potential-resolvers/nullish';
import type { SpecialKeys, ValueBasedResolver } from '../potential-resolvers/types';
import { createValueResolver } from '../potential-resolvers/value';
import { createObjectResolver } from '../potential-resolvers/object';

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: readonly K[],
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
