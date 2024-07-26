import { createResult } from '../create-result';
import type { AllowNullish, Nullish, TypeCheckFunction } from '../private-types';
import { errorInvalidKey, errorInvalidValue } from '../tools/errors';
import { is, isArray } from '../tools/is';
import { resolveKey } from '../tools/key';
import type { KeyList, PotentialResolver, Resolved, SpecialKeys } from './types';

type ResultExtendItem<K extends string, V> = [keys: KeyList<K>, value: V];
type ObjectProcessed<K extends string, V> = [override: V, keys: Array<ResultExtendItem<K, V>>, special: Array<ResultExtendItem<K, V>>];

function processInput<K extends string, S extends string, V>(
  input: object,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  defaultKey: string,
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): ObjectProcessed<K, V> {

  // get input object keys
  const objectKeys = Object.keys(input);

  // return array containing processed data
  return objectKeys.reduce((output, key) => {

    // get object key value
    const value = input[key as never];

    // go to next step if value is nullish
    if (value == null) return output;

    // throw if value is not valid
    if (!isValidValue(value)) throw errorInvalidValue(value);

    // destructure data array
    const [override, keysData, specialData] = output;

    // set override value if key equals override key
    if (key === defaultKey) return [value, keysData, specialData];

    // try to resolve key as regular key
    const keyResolved = resolveKey(key, keys);

    // extend regular key data if regular key resolved
    if (keyResolved) {
      const item: ResultExtendItem<K, V> = [keyResolved, value];
      const newItems = [...keysData, item];
      return [override, newItems, specialData];
    }

    // throw if special is not defined at this point
    if (!special) throw errorInvalidKey(key);

    // try to resolve key as special key
    const specialResolved = special[key as S];

    // throw if key can't be resolved as special key
    if (!specialResolved) throw errorInvalidKey(key);

    // extend special key data if special key resolved
    const item: ResultExtendItem<K, V> = [specialResolved, value];
    const newSpecialKeys = [...specialData, item];
    return [override, keysData, newSpecialKeys];

  }, [defaultValue, [], []] as ObjectProcessed<K, V>);

}

function resultReducer<K extends string, V>(output: Resolved<K, V>, [keys, value]: ResultExtendItem<K, V>): Resolved<K, V> {
  return createResult(
    keys,
    value,
    output,
  );
}

export function createObjectResolver<K extends string, S extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: string,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: string,
  special: Nullish,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: string,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, S extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: string,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, V>;

export function createObjectResolver<K extends string, S extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: string,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, V> {

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
      resultReducer,
      specialData.reduce(
        resultReducer,
        createResult(keys, overrideValue),
      ),
    );

  };

}
