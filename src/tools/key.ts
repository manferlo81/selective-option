import type { AllowNullish, KeyList, SpecialKeys } from '../private-types';

export function resolveKey<K extends string, S extends string>(key: string, keys: KeyList<K>, special: SpecialKeys<S, K>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined;
export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined {
  if (keys.includes(key as K)) return [key as K];
  if (!special) return;
  return special[key] as K[] | undefined;
}

type KeyResolved<K extends string> = [keys: K[], value: boolean];

export function resolveKey_v2<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): KeyResolved<K> | undefined {

  const trimmedKey = key.trim();

  // try to resolve positive key
  const resolved = resolveKey(trimmedKey, keys, special);

  // return positive key result if resolved
  if (resolved) return [resolved, true];

  // match key for negative key
  const matched = /^[!-]([^\s]*)$/.exec(trimmedKey);

  // fail if it doesn't match
  if (!matched) return;

  // get key from matched result
  const [matchedKey] = matched.slice(1);

  // try to resolve matched key
  const matchedResolved = resolveKey(matchedKey, keys, special);

  // fail if it can't be resolved
  if (!matchedResolved) return;

  // return negative key result
  return [matchedResolved, false];

}
