import type { AllowNullish } from '../types/private-types';
import type { KeyList, SpecialKeys } from '../types/resolver-types';

export function resolveKey<K extends string, S extends string>(key: string, keys: KeyList<K>, special: SpecialKeys<S, K>): readonly K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): readonly K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<Partial<SpecialKeys<string, K>>>): readonly K[] | undefined {
  if (keys.includes(key as never)) return [key as K];
  if (!special) return;
  return special[key];
}
