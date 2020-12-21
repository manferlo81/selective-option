import { createResult } from './create-result';
import { errorInvalidKey } from './errors';
import { isArray } from './type-check';
import type { Nullable, PotentialResolver, SelectiveResolved, TypeCheckFunction } from './types';

function processString<K extends string>(
  key: string,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  const specialKeys: Nullable<K[]> = special && special[key];

  if (specialKeys) {
    const result = input || createResult(keys, false);
    const { length: len } = specialKeys;
    for (let i = 0; i < len; i++) {
      result[specialKeys[i]] = true;
    }
    return result;
  }

  if (isKey(key)) {
    const result = input || createResult(keys, false);
    result[key] = true;
    return result;
  }

}

export function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (typeof value === 'string') {
      return processString(
        value,
        keys,
        isKey,
        special,
      );
    }
  };
}

export function createArrayResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean> {
  return (value) => {
    if (isArray(value)) {

      const result = createResult(keys, false);

      for (let i = 0; i < value.length; i++) {
        const key = value[i];
        if (
          (typeof key !== 'string') ||
          !processString(
            key,
            keys,
            isKey,
            special,
            result,
          )
        ) {
          throw errorInvalidKey(key);
        }
      }

      return result;

    }
  };
}

/** @deprecated */
export function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): SelectiveResolved<K, boolean> | void {
  return createStringResolver(
    keys,
    isKey,
    special,
  )(value);
}

/** @deprecated */
export function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): SelectiveResolved<K, boolean> | void {
  return createArrayResolver(
    keys,
    isKey,
    special,
  )(value);
}
