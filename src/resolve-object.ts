import { keysToObject } from './extend';
import { isArray, isObject } from './type-check';
import type { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveObject<K extends string, S extends string, V>(
  object: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): SelectiveResolved<K, V> {

  if (!isObject(object) || isArray(object)) {
    throw new Error();
  }

  const objectKeys = Object.keys(object);

  let overrideValue: [V] | undefined;
  let specialData: Array<[K[], V]> | undefined;
  let keysData: Array<[K, V]> | undefined;

  const { length: len } = objectKeys;
  for (let i = 0; i < len; i++) {

    const key = objectKeys[i];
    const value = object[key];

    if (value != null) {

      if (!isValidValue(value)) {
        throw new Error('Invalid object value');
      }

      if (key === 'default') {
        overrideValue = [value];
      } else if (isSpecialKey(key)) {
        (specialData || (specialData = [])).push([special[key], value]);
      } else if (isKey(key)) {
        (keysData || (keysData = [])).push([key, value]);
      } else {
        throw new Error('Invalid object key');
      }

    }

  }

  const result = keysToObject(
    keys,
    overrideValue ? overrideValue[0] : defaultValue,
  );

  if (specialData) {
    const { length: len } = specialData;
    for (let i = 0; i < len; i++) {
      const [regularKeys, value] = specialData[i];
      keysToObject(
        regularKeys,
        value,
        result,
      );
    }
  }

  if (keysData) {
    const { length: len } = keysData;
    for (let i = 0; i < len; i++) {
      const [key, value] = keysData[i];
      result[key] = value;
    }
  }

  return result;

}
