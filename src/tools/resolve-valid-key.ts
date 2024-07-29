import type { AllowNullish, KeyList, KeyResolved, SpecialKeys } from '../private-types';
import { is } from './is';
import { resolveKey } from './key';

export function resolveKeyIfValid<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): KeyResolved<K> | undefined {

  // throw if item is not a string
  if (!is(key, 'string')) return;

  // try to resolve positive key
  const resolved = resolveKey(key, keys, special);

  // return positive key result if resolved
  if (resolved) return [resolved, true];

  // test for negative key format
  const matched = /^[!-]([^\s]*)$/.exec(key);

  // fail if it doesn't match negative format
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
