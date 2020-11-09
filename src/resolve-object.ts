import { keysToObject } from './extend';
import { isArray, isObject } from './type-check';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveObject<K extends string, S extends string, V, D = V>(
  object: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): SelectiveResolved<K, V | D> {

  if (!isObject(object) || isArray(object)) {
    throw new Error(`${object} is not a valid value`);
  }

  const objectKeys = Object.keys(object);

  let overrideValue: [V] | undefined;
  let specialData: Array<[K[], V]> | undefined;
  let keysData: Array<[K, V]> | undefined;

  const len = objectKeys.length;
  for (let i = 0; i < len; i++) {

    const key = objectKeys[i];
    const value = object[key];

    if (value != null) {

      if (!isValidValue(value)) {
        throw new Error(`${value} is not a valid value`);
      }

      if (key === 'default') {
        overrideValue = [value];
      } else if (isSpecialKey(key)) {
        (specialData || (specialData = [])).push([special[key], value]);
      } else if (isKey(key)) {
        (keysData || (keysData = [])).push([key, value]);
      } else {
        throw new Error(`"${key}" is not a valid key`);
      }

    }

  }

  const result = keysToObject(
    keys,
    overrideValue ? overrideValue[0] : defaultValue,
  );

  if (specialData) {
    const slen = specialData.length;
    for (let s = 0; s < slen; s++) {
      keysToObject(
        specialData[s][0],
        specialData[s][1],
        result,
      );
    }
  }

  if (keysData) {
    const klen = keysData.length;
    for (let k = 0; k < klen; k++) {
      result[keysData[k][0]] = keysData[k][1];
    }
  }

  return result;

}
