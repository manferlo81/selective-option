import { keysToObject } from './extend';
import { SelectiveResolved, TypeCheckFunction } from './types';

export function applyKey<K extends string, S extends string, T>(
  key: unknown,
  value: T,
  result: SelectiveResolved<K, T>,
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
): SelectiveResolved<K, T> | void {

  if (isKey(key)) {
    result[key] = value;
    return result;
  }

  if (isSpecialKey(key)) {
    return keysToObject(
      special[key],
      value,
      result,
    );
  }

}
