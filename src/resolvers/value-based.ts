import type { ValueBasedSelectiveOption } from '../types/input-types';
import type { AllowNullish, Nullish, TypeCheckFunction } from '../types/private-types';
import { createResolver } from './create-resolver';
import { createObjectResolver } from './object';
import type { KeyList, SpecialKeys, ValueBasedResolver } from '../types/resolver-types';
import { createValueResolver } from './value';

export function createValueBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): ValueBasedResolver<K, S | O, V, D>;

export function createValueBasedResolver<K extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish,
): ValueBasedResolver<K, O, V, D>;

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): ValueBasedResolver<K, S | O, V>;

export function createValueBasedResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: Nullish,
): ValueBasedResolver<K, O, V>;

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): ValueBasedResolver<K, S | O, V>;

export function createValueBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): ValueBasedResolver<K, S | O, V, D> {

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue, defaultValue);
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, overrideKey, special);

  // return compiled resolver
  return createResolver<K, V | D, ValueBasedSelectiveOption<K, V>>(
    resolveValue,
    resolveObject,
  );

}
