import type { AllowNullish, KeyResolved, NegativeKeyPrefix, PositiveKeyPrefix } from '../private-types';
import type { KeyList, SpecialKeys } from '../resolvers/types';
import { is } from './is';
import { resolveKey } from './key';

const polarityPrefixes = ['!', '+', '-'] as ReadonlyArray<PositiveKeyPrefix | NegativeKeyPrefix>;

export function resolveKeyIfValid<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): KeyResolved<K> | undefined {

  // throw if item is not a string
  if (!is(key, 'string')) return;

  // try to resolve positive key
  const resolved = resolveKey(key, keys, special);

  // return positive key result if resolved
  if (resolved) return [resolved, true];

  // get first character to test for key polarity
  const sign = key.charAt(0);

  // fail if first character in not a polarity prefix
  if (!polarityPrefixes.includes(sign)) return;

  // get key without polarity
  const absoluteKey = key.slice(1);

  // try to resolve key
  const matchedResolved = resolveKey(absoluteKey, keys, special);

  // fail if it can't be resolved
  if (!matchedResolved) return;

  // return key result with polarity
  return [matchedResolved, sign === '+'];

}
