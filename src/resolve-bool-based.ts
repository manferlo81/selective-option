import type { AllowNullish, TypeCheckFunction } from './helper-types';
import { createArrayResolver } from './resolve-array';
import { resolveFailed } from './resolve-failed';
import { createNullishResolver } from './resolve-nullish';
import { createObjectResolver } from './resolve-object';
import { createStringResolver } from './resolve-string';
import { createValueResolver } from './resolve-value';
import type { Resolver } from './types';

export function createBoolBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D | boolean> {
  const resolveValue = createValueResolver(keys, isValidValue);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, isKey, special);
  const resolveArray = createArrayResolver(keys, isKey, special);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, isKey, special, defaultKey);
  return (value) => (
    resolveValue(value) ||
    resolveNullish(value) ||
    resolveString(value) ||
    resolveArray(value) ||
    resolveObject(value) ||
    resolveFailed(value)
  );
}
