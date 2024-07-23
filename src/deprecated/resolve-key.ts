import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createKeyResolver } from '../resolvers/key';
import type { KeyResolver, SpecialKeys } from '../resolvers/types';

export function resolveKey<K extends string>(
  key: string,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): ReturnType<KeyResolver<K>> {
  const resolve = createKeyResolver(isKey, special);
  return resolve(key);
}
