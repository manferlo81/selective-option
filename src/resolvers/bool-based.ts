import type { BoolBasedSelectiveOption } from '../input-types';
import type { AllowNullish, KeyList, Nullish, SpecialKeys, TypeCheckFunction } from '../private-types';
import { createResolver } from './create-resolver';
import { createKeyListResolver } from './key-list';
import { createObjectResolver } from './object';
import { createKeyResolver } from './single-key';
import type { BoolBasedResolver } from './types';
import { createValueResolver } from './value';

function wrapValueValidator<V>(isValidValue: AllowNullish<TypeCheckFunction<V>>): TypeCheckFunction<V | boolean> {
  const isBoolean: TypeCheckFunction<boolean> = (value) => {
    return value === true || value === false;
  };
  if (!isValidValue) return isBoolean;
  const isValueOrBool: TypeCheckFunction<V | boolean> = (value) => {
    return isValidValue(value) || isBoolean(value);
  };
  return isValueOrBool;
}

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V | boolean,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, V | boolean, O>;

export function createBoolBasedResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V | boolean,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, V | boolean, O>;

export function createBoolBasedResolver<K extends string, S extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: boolean,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, boolean, O>;

export function createBoolBasedResolver<K extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: Nullish,
  defaultValue: boolean,
  overrideKey: O,
  special?: Nullish,
): BoolBasedResolver<K, never, boolean, O>;

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: AllowNullish<TypeCheckFunction<V>>,
  defaultValue: V | boolean,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): BoolBasedResolver<K, S, V | boolean, O>;

export function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: AllowNullish<TypeCheckFunction<V>>,
  defaultValue: V | boolean,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): BoolBasedResolver<K, S, V | boolean, O> {

  // create boolean value validator
  const isValueOrBool = wrapValueValidator(isValidValue);

  // create potential resolvers
  const resolveValue = createValueResolver(keys, isValueOrBool, defaultValue);
  const resolveSingleKey = createKeyResolver(keys, special);
  const resolveKeyList = createKeyListResolver(keys, special);
  const resolveObject = createObjectResolver(keys, isValueOrBool, defaultValue, overrideKey, special);

  // return compiled resolver
  return createResolver<K, V | boolean, BoolBasedSelectiveOption<K | S, V, O>>(
    resolveValue,
    resolveSingleKey,
    resolveKeyList,
    resolveObject,
  );

}
