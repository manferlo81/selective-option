import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import type { KeyResolver, SpecialKeys } from './types';

export function createKeyResolver<K extends string>(
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): KeyResolver<K> {

  return (key) => {

    if (isKey(key)) {
      return [key];
    }

    if (!special) return;

    return special[key];

  };

}
