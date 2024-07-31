import type { AllowNullish } from '../private-types';
import type { KeyList, SpecialKeys } from '../resolvers/types';

export function resolveKey<K extends string, S extends string>(key: string, keys: KeyList<K>, special: SpecialKeys<S, K>): readonly K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): readonly K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<Partial<SpecialKeys<string, K>>>): readonly K[] | undefined {
  if (keys.includes(key)) return [key];
  if (!special) return;
  return special[key];
}
