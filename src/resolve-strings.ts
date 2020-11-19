import { createResult } from './create-result';
import { isArray } from './type-check';
import type { Nullable, ResolveStringOptions, SelectiveResolved } from './types';

export function resolveString<K extends string>(
  value: unknown,
  options: ResolveStringOptions<K>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  const { keys, isKey, special } = options;

  if (typeof value === 'string') {

    const specialKeys: Nullable<K[]> = special && special[value];

    if (specialKeys) {
      return resolveArray(
        specialKeys,
        options,
        input || createResult(keys, false),
      );
    }

    if (isKey(value)) {
      const result = input || createResult(keys, false);
      result[value] = true;
      return result;
    }

  }

}

export function resolveArray<K extends string>(
  value: unknown,
  options: ResolveStringOptions<K>,
  input?: SelectiveResolved<K, boolean>,
): SelectiveResolved<K, boolean> | void {

  const { keys } = options;

  if (isArray(value)) {

    const result = input || createResult(keys, false);

    for (let i = 0; i < value.length; i++) {

      const key = value[i];

      if (
        !resolveString(
          key,
          options,
          result,
        )
      ) {
        throw new Error(`"${key}" is not a valid key`);
      }

    }

    return result;

  }

}
