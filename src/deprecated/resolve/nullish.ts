import { createNullishResolver } from '../../resolvers/nullish';

/** @deprecated */
export function resolveNullish<K extends string, D>(
  value: unknown,
  keys: K[],
  defaultValue: D,
): Record<K, D> | void {
  return createNullishResolver(
    keys,
    defaultValue,
  )(value);
}
