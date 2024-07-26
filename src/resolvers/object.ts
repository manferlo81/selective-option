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
  const objectKeys = Object.keys(input);
  return objectKeys.reduce((output, key) => {
    const value = input[key as never];
    if (value == null) return output;
    if (!isValidValue(value)) throw errorInvalidValue(value);
    const [override, keysData, specialData] = output;
    if (key === defaultKey) return [value, keysData, specialData];
    const keyResolved = resolveKey(key, keys);
    if (keyResolved) {
      const item: ResultExtendItem<K, V> = [keyResolved, value];
      const newItems = [...keysData, item];
      return [override, newItems, specialData];
    }
    if (!special) throw errorInvalidKey(key);
    const specialResolved = special[key as S];
    if (!specialResolved) throw errorInvalidKey(key);
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

    const [overrideValue, keysData, specialData] = processInput(
      input,
      isValidValue,
      defaultValue,
      overrideKey,
      keys,
      special,
    );

    return keysData.reduce(
      resultReducer,
      specialData.reduce(
        resultReducer,
        createResult(keys, overrideValue),
      ),
    );

  };

}
