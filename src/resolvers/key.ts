import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createFunctionReturning } from '../tools';
import { isArray } from '../type-check';
import type { KeyResolver, SpecialKeys } from './types';

export function createKeyResolver<K extends string>(isKey: TypeCheckFunction<K>): KeyResolver<K> {
  return (key) => {
    if (isKey(key)) {
      return [key];
    }
  };
}

export function createSpecialKeyResolver<K extends string>(isKey: TypeCheckFunction<K>, specialData?: AllowNullish<SpecialKeys<string, K>>): KeyResolver<K> {

  // return function returning undefined if not special data object provided
  if (specialData == null) return createFunctionReturning();

  // get special keys from special data object
  const specialKeys = Object.keys(specialData);

  // validate special data object
  for (const specialKey of specialKeys) {
    const keys = specialData[specialKey];
    if (!isArray(keys)) throw '';
    for (const key of keys) {
      if (!isKey(key)) throw '';
    }
  }

  // return resolver
  return (key) => specialData[key];

}

export function createMultiKeyResolver<K extends string>(isKey: TypeCheckFunction<K>, specialData?: AllowNullish<SpecialKeys<string, K>>): KeyResolver<K> {
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, specialData);
  return (key) => resolveKey(key) || resolveSpecialKey(key);
}
