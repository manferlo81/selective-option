import { createResult } from './create-result';
import { errorInvalidKey } from './errors';
import { isArray } from './type-check';
import type { Nullable, ResolveStringOptions, SelectiveResolved, TypeCheckFunction } from './types';

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

export function resolveString<K extends string>(
  value: unknown,
  options: ResolveStringOptions<K>,
): SelectiveResolved<K, boolean> | void {
  if (typeof value === 'string') {
    return processString(
      value,
      options.keys,
      options.isKey,
      options.special,
    );
  }
}

export function resolveArray<K extends string>(
  value: unknown,
  options: ResolveStringOptions<K>,
): SelectiveResolved<K, boolean> | void {

  if (isArray(value)) {

    const result = createResult(options.keys, false);

    for (let i = 0; i < value.length; i++) {
      const key = value[i];
      if (
        (typeof key !== 'string') ||
        !processString(
          key,
          options.keys,
          options.isKey,
          options.special,
          result,
        )
      ) {
        throw errorInvalidKey(key);
      }
    }

    return result;

  }

}
