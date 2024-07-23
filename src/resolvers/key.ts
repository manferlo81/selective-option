import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { isArray } from '../type-check';
import type { KeyResolver, SpecialKeys } from './types';

export function createSpecialKeyResolver<K extends string>(
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): KeyResolver<K> {

  if (!special) return () => { /**/ };

  const specialKeys = Object.keys(special);
  for (const specialKey of specialKeys) {
    const keys = special[specialKey];
    if (!isArray(keys)) throw '';
    for (const key of keys) {
      if (!isKey(key)) throw '';
    }
  }

  return (key) => {
    const keys = special[key];
    if (!keys) return;
    return [keys, true];
  };

}

export function createKeyResolver<K extends string>(
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): KeyResolver<K> {

  const resolveSpecial = createSpecialKeyResolver(isKey, special);

  return (key) => {

    if (isKey(key)) {
      return [[key], false];
    }

    return resolveSpecial(key);

  };

}
