import type { KeyList, AllowNullish, SpecialKeys } from '../private-types';
import { is } from './is';
import { resolveKey_v2 } from './key';

export function resolveKeyIfValid<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): [keys: K[], value: boolean] | undefined {

  // throw if item is not a string
  if (!is(key, 'string')) return;

  // try to resolve as key or special key
  return resolveKey_v2(key, keys, special);

}
