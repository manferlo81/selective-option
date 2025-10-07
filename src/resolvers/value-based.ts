import { createFunctionResolver } from '../potential/function'
import { createObjectResolver } from '../potential/object'
import { createValueResolver } from '../potential/value'
import { createResolver } from '../tools/create-resolver'
import type { ValueBasedSelectiveOption } from '../types/input-types'
import type { Nullish, TypeCheckFunction } from '../types/private-types'
import type { KeyList, SpecialKeys, ValueBasedResolver } from '../types/resolver-types'

export function createValueBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): ValueBasedResolver<K, S | O, V, D>

export function createValueBasedResolver<K extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish,
): ValueBasedResolver<K, O, V, D>

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): ValueBasedResolver<K, S | O, V>

export function createValueBasedResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: Nullish,
): ValueBasedResolver<K, O, V>

export function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: SpecialKeys<S, K> | Nullish,
): ValueBasedResolver<K, S | O, V>

export function createValueBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: SpecialKeys<S, K> | Nullish,
): ValueBasedResolver<K, S | O, V, D> {

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValidValue, defaultValue)
  const resolveFunction = createFunctionResolver(keys, isValidValue, defaultValue)
  const resolveObject = createObjectResolver(keys, isValidValue, defaultValue, overrideKey, special)

  // return compiled resolver
  return createResolver<K, V | D, ValueBasedSelectiveOption<K, O | S, V>>(
    resolveValue,
    resolveFunction,
    resolveObject,
  )

}
