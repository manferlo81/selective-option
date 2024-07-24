import { createResult } from '../../create-result';
import { errorInvalidKey, errorInvalidValue } from '../../errors';
import type { TypeCheckFunction } from '../../helper-types';
import { is, isArray } from '../../is';
import type { PotentialResolver, Resolved } from '../../types';
import type { KeyResolver } from '../types';

type ResultExtendItem<K extends string, V> = [keys: readonly K[], value: V];
type ObjectProcessed<K extends string, V> = [override: V, keys: Array<ResultExtendItem<K, V>>, special: Array<ResultExtendItem<K, V>>];

function processInput<K extends string, V>(
  input: Record<string, unknown>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  defaultKey: string,
): ObjectProcessed<K, V> {
  const objectKeys = Object.keys(input);
  return objectKeys.reduce((output, key) => {
    const value = input[key];
    if (value == null) return output;
    if (!isValidValue(value)) throw errorInvalidValue(value);
    const [override, keys, special] = output;
    if (key === defaultKey) return [value, keys, special];
    const keyResolved = resolveKey(key);
    if (keyResolved) {
      const item: ResultExtendItem<K, V> = [keyResolved, value];
      const newItems = [...keys, item];
      return [override, newItems, special];
    }
    const specialResolved = resolveSpecialKey(key);
    if (!specialResolved) throw errorInvalidKey(key);
    const item: ResultExtendItem<K, V> = [specialResolved, value];
    const newSpecialKeys = [...special, item];
    return [override, keys, newSpecialKeys];
  }, [defaultValue, [], []] as ObjectProcessed<K, V>);

}

function resultReducer<K extends string, V>(output: Resolved<K, V>, [keys, value]: ResultExtendItem<K, V>): Resolved<K, V> {
  return createResult(
    keys,
    value,
    output,
  );
}

export function createObjectResolver_v2<K extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  resolveKey: KeyResolver<K>,
  resolveSpecialKey: KeyResolver<K>,
  defaultKey: string = 'default',
): PotentialResolver<K, V> {

  // return object resolver
  return (input) => {

    // exit if it's not an object
    if (!input || !is<Record<string, V> | null | unknown[]>(input, 'object') || isArray(input)) return;

    const [overrideValue, keysData, specialData] = processInput(
      input,
      isValidValue,
      defaultValue,
      resolveKey,
      resolveSpecialKey,
      defaultKey,
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
