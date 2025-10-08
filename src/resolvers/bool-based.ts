import { createFunctionResolver } from '../potential/function'
import { createKeyListResolver } from '../potential/key-list'
import { createObjectResolver } from '../potential/object'
import { createKeyResolver } from '../potential/single-key'
import { createValueResolver } from '../potential/value'
import { createResolver } from '../tools/create-resolver'
import type { Nullish, TypeCheckFunction } from '../types/helper-types'
import type { BoolBasedSelectiveOption } from '../types/input-types'
import type { BoolBasedResolver, KeyList, SpecialKeys } from '../types/resolver-types'

function wrapValueValidator<V>(isValidValue: Nullish<TypeCheckFunction<V>>): TypeCheckFunction<V | boolean> {
  const isBoolean: TypeCheckFunction<boolean> = (value) => {
    return value === true || value === false
  }
  if (!isValidValue) return isBoolean
  const isValueOrBool: TypeCheckFunction<V | boolean> = (value) => {
    return isValidValue(value) || isBoolean(value)
  }
  return isValueOrBool
}

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, V | boolean, O, D>

export function createBoolBasedResolver<K extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, V | boolean, O, D>

export function createBoolBasedResolver<K extends string, S extends string, O extends string, D>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: D,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, boolean, O, D>

export function createBoolBasedResolver<K extends string, O extends string, D>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, boolean, O, D>

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V | boolean,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, V | boolean, O>

export function createBoolBasedResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V | boolean,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, V | boolean, O>

export function createBoolBasedResolver<K extends string, S extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: boolean,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, boolean, O>

export function createBoolBasedResolver<K extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: boolean,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, boolean, O>

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: Nullish<TypeCheckFunction<V>>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish<SpecialKeys<S, K>>,
): BoolBasedResolver<K, S, V | boolean, O, D>

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: Nullish<TypeCheckFunction<V>>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish<SpecialKeys<S, K>>,
): BoolBasedResolver<K, S, V | boolean, O, D> {

  // create boolean value validator
  const isValueOrBool = wrapValueValidator(isValidValue)

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValueOrBool, defaultValue)
  const resolveFunction = createFunctionResolver(keys, isValueOrBool, defaultValue)
  const resolveSingleKey = createKeyResolver(keys, special)
  const resolveKeyList = createKeyListResolver(keys, special)
  const resolveObject = createObjectResolver(keys, isValueOrBool, defaultValue, overrideKey, special)

  // return compiled resolver
  return createResolver<K, boolean | V | D, BoolBasedSelectiveOption<K, S, boolean | V, O>>(
    resolveValue,
    resolveFunction,
    resolveSingleKey,
    resolveKeyList,
    resolveObject,
  )

}
