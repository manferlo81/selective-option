import type { AllowNullish, KeyList, SpecialKeys } from '../private-types';

export function resolveKey<K extends string, S extends string>(key: string, keys: KeyList<K>, special: SpecialKeys<S, K>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined {
  if (keys.includes(key as K)) return [key as K];
  if (!special) return;
  return special[key] as K[] | undefined;
}
