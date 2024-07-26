import type { AllowNullish, TypeCheckFunction } from '../private-types';
import { createArrayResolver } from './array';
import { createResolver } from './create-resolver';
import { createNullishResolver } from './nullish';
import { createObjectResolver } from './object';
import { createStringResolver } from './string';
import type { BoolBasedResolver, KeyList, SpecialKeys } from './types';
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
  special: AllowNullish<never>,
): BoolBasedResolver<K, never, V | boolean, O>;

export function createBoolBasedResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V | boolean,
  overrideKey: O,
): BoolBasedResolver<K, never, V | boolean, O>;

export function createBoolBasedResolver<K extends string, S extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: AllowNullish<never>,
  defaultValue: boolean,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): BoolBasedResolver<K, S, boolean, O>;

export function createBoolBasedResolver<K extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: AllowNullish<never>,
  defaultValue: boolean,
  overrideKey: O,
  special: AllowNullish<never>,
): BoolBasedResolver<K, never, boolean, O>;

export function createBoolBasedResolver<K extends string, O extends string>(
  keys: KeyList<K>,
  isValidValue: AllowNullish<never>,
  defaultValue: boolean,
  overrideKey: O,
): BoolBasedResolver<K, never, boolean, O>;

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
  const resolveValue = createValueResolver(keys, isValueOrBool);
  const resolveNullish = createNullishResolver(keys, defaultValue);
  const resolveString = createStringResolver(keys, special);
  const resolveArray = createArrayResolver(keys, special);
  const resolveObject = createObjectResolver(keys, isValueOrBool, defaultValue, overrideKey, special);

  // return compiled resolver
  return createResolver<K, V | boolean>(
    resolveValue,
    resolveNullish,
    resolveString,
    resolveArray,
    resolveObject,
  );

}
