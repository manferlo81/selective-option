import { createResult } from './create-result';
import { isArray } from './type-check';
import type { Nullable, ResolveStringOptions, SelectiveResolved, TypeCheckFunction } from './types';

function __resolveString<K extends string>(
  key: string,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  const specialKeys: Nullable<K[]> = special && special[key];

  if (specialKeys) {
    const result = input || createResult(keys, false);
    for (const key of specialKeys) {
      result[key] = true;
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

    const { keys, isKey, special } = options;

    return __resolveString(
      value,
      keys,
      isKey,
      special,
    );

  }

}

export function resolveArray<K extends string>(
  value: unknown,
  options: ResolveStringOptions<K>,
): SelectiveResolved<K, boolean> | void {

  if (isArray(value)) {

    const { keys, isKey, special } = options;

    const result = createResult(keys, false);

    for (let i = 0; i < value.length; i++) {

      const key = value[i];

      if (
        typeof key !== 'string' ||
        !__resolveString(
          key,
          keys,
          isKey,
          special,
          result,
        )
      ) {
        throw new Error(`"${key}" is not a valid key`);
      }

    }

    return result;

  }

}
