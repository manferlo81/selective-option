import { createResult } from './create-result';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveString<K extends string, S extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
): SelectiveResolved<K, boolean> | void {

  if (isSpecialKey(value)) {
    return createResult(
      special[value],
      true,
      createResult(
        keys,
        false,
      ),
    );
  }

  if (isKey(value)) {
    const result = createResult(
      keys,
      false,
    );
    result[value] = true;
    return result;
  }

}
