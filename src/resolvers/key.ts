import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { KeyResolver, SpecialKeys } from './types';

export function createKeyResolver<K extends string>(
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): KeyResolver<K> {

  return (key) => {

    if (isKey(key)) {
      return [[key], false];
    }

    if (!special) return;

    const keys = special[key];

    if (!keys) return;

    return [keys, true];

  };

}
