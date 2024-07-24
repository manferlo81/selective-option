import type { AllowNullish, TypeCheckFunction } from '../helper-types';
import { createKeyResolver, createSpecialKeyResolver } from './key';
import type { BoolBasedResolver } from './types';
import { createBoolBasedResolver_v2 } from './v2/bool-based';

export function createBoolBasedResolver<K extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special?: null | undefined
): BoolBasedResolver<K, never, V, 'default'>;

export function createBoolBasedResolver<K extends string, S extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
): BoolBasedResolver<K, S, V, 'default'>;

export function createBoolBasedResolver<K extends string, V, O extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special: null | undefined,
  overrideKey: O,
): BoolBasedResolver<K, never, V, O>;

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  overrideKey: O,
): BoolBasedResolver<K, S, V, O>;

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<S, K[]>>,
  overrideKey?: O,
): BoolBasedResolver<K, S, V, O>;

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string = 'default'>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<Record<S, K[]>>,
  overrideKey?: O,
): BoolBasedResolver<K, S, V, O> {

  // create key resolvers
  const resolveKey = createKeyResolver(isKey);
  const resolveSpecialKey = createSpecialKeyResolver(isKey, special);

  // return compiled resolver
  return createBoolBasedResolver_v2(
    keys,
    isValidValue,
    defaultValue,
    resolveKey,
    resolveSpecialKey,
    overrideKey,
  );

}
