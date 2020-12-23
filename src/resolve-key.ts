import type { Nullable, TypeCheckFunction } from './types';

export function resolveKey<K extends string>(
  key: string,
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
): K[] | void {

  const resolved = special && special[key];

  if (resolved) {
    return resolved;
  }

  if (isKey(key)) {
    return [key];
  }

}
