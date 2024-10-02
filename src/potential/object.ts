/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { createResult } from '../tools/create-result';
import { errorInvalidKey } from '../tools/errors';
import { is, isArray } from '../tools/is';
import { resolveKey } from '../tools/resolve-key';
import { validateValueOrThrow } from '../tools/value-nullish';
import type { AllowNullish, Nullish, TypeCheckFunction } from '../types/private-types';
import type { KeyList, PotentialResolver, Resolved, SpecialKeys } from '../types/resolver-types';

type ObjectProcessed<K extends string, V, D> = [override: V | D, keys: Array<Resolved<K, V>>, special: Array<Resolved<K, V>>];

function processInput<K extends string, S extends string, V, D = V>(
  input: object,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: string,
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): ObjectProcessed<K, V, D> {

  // get input object keys
  const objectKeys = Object.keys(input);

  // return array containing processed data
  return objectKeys.reduce<ObjectProcessed<K, V, D>>((output, key) => {

    // get object key value
    const value = input[key as never];

    // get data from value if it's valid or nullish
    const [isValid, validatedValue] = validateValueOrThrow(value, isValidValue);

    // return output without changes if value is nullish
    if (!isValid) return output;

    // destructure output array
    const [override, keysData, specialData] = output;

    // set override value if key equals override key
    if (key === overrideKey) return [validatedValue, keysData, specialData];

    const keyResolved__ = resolveKey(key, keys, special);

    if (!keyResolved__) throw errorInvalidKey(key);

    const [keyResolved, isSpecial] = keyResolved__;
    const item = createResult(keyResolved, validatedValue);

    if (isSpecial) {
      const newSpecialData = [...specialData, item];
      return [override, keysData, newSpecialData];
    }

    const newKeysData = [...keysData, item];
    return [override, newKeysData, specialData];

    // // try to resolve key as regular key
    // const keyResolved = resolveKey(key, keys);

    // // extend regular key data if regular key resolved
    // if (keyResolved) {
    //   const item = createResult(keyResolved, validatedValue);
    //   const newKeysData = [...keysData, item];
    //   return [override, newKeysData, specialData];
    // }

    // // throw if special is not defined at this point
    // if (!special) throw errorInvalidKey(key);

    // // try to resolve key as special key
    // const specialResolved = special[key as S] as K[] | undefined;

    // // throw if key can't be resolved as special key
    // if (!specialResolved) throw errorInvalidKey(key);

    // // extend special key data if special key resolved
    // const item = createResult(specialResolved, validatedValue);
    // const newSpecialData = [...specialData, item];
    // return [override, keysData, newSpecialData];

  }, [defaultValue, [], []]);

}

function extendResolved<K extends string, V>(output: Resolved<K, V>, extension: Resolved<K, V>): Resolved<K, V> {
  return { ...output, ...extension };
}

export function createObjectResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, V | D>;

export function createObjectResolver<K extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: Nullish,
): PotentialResolver<K, V | D>;

export function createObjectResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: Nullish,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, V | D>;

export function createObjectResolver<K extends string, S extends string, V, O extends string, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  overrideKey: O,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, V | D> {

  // return object resolver
  return (input) => {

    // exit if it's not an object
    if (!input || !is(input, 'object') || isArray(input)) return;

    // process input object
    const [overrideValue, keysData, specialData] = processInput(
      input,
      isValidValue,
      defaultValue,
      overrideKey,
      keys,
      special,
    );

    // return result create from processed input object
    return keysData.reduce(
      extendResolved,
      specialData.reduce(
        extendResolved,
        createResult(keys, overrideValue),
      ),
    );

  };

}
