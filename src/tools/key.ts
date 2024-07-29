import type { AllowNullish, KeyList, SpecialKeys } from '../private-types';

declare global {
  interface ReadonlyArray<T> {
    includes<E>(searchElement: E, fromIndex?: number): searchElement is E & T;
  }
}

export function resolveKey<K extends string, S extends string>(key: string, keys: KeyList<K>, special: SpecialKeys<S, K>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<Partial<SpecialKeys<string, K>>>): K[] | undefined {
  if (keys.includes(key)) return [key];
  if (!special) return;
  return special[key];
}
