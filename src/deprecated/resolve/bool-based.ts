import type { TypeCheckFunction } from '../../helper-types';
import { BoolBasedSelectiveOption } from '../../input-types';
import { createBoolBasedResolver } from '../../resolvers/bool-based';
import type { Resolved } from '../../types';

/** @deprecated */
export function resolveBoolBased<K extends string, S extends string, V>(
  value: BoolBasedSelectiveOption<K | S, V, 'default'>,
  keys: readonly K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): Resolved<K, V | boolean> {
  return createBoolBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    isKey,
    special,
  )(value);
}
