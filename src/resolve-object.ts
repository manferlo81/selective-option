import { createResult } from './create-result';
import { errorInvalidKey, errorInvalidValue } from './errors';
import { isArray } from './type-check';
import type { Nullable, ResolveObjectOptions, SelectiveResolved } from './types';

export function resolveObject<K extends string, V, D = V, DK extends string = 'default'>(
  object: unknown,
  options: ResolveObjectOptions<K, V, D, DK>,
): SelectiveResolved<K, V | D> | void {

  if (typeof object === 'object' && object && !isArray(object)) {

    const objectKeys = Object.keys(object);

    let overrideValue: [V] | undefined;
    let specialData: Array<[K[], V]> | undefined;
    let keysData: Array<[K, V]> | undefined;

    const len = objectKeys.length;
    for (let i = 0; i < len; i++) {

      const key = objectKeys[i];
      const value = object[key as never];

      if (value != null) {

        if (!options.isValidValue(value)) {
          throw errorInvalidValue(value);
        }

        const defaultKey = options.defaultKey || 'default';

        if (key === defaultKey) {
          overrideValue = [value];
        } else {
          const { special } = options;
          const specialKeys: Nullable<K[]> = special && special[key];
          if (specialKeys) {
            (specialData || (specialData = [])).push([specialKeys, value]);
          } else if (options.isKey(key)) {
            (keysData || (keysData = [])).push([key, value]);
          } else {
            throw errorInvalidKey(key);
          }
        }

      }

    }

    const result = createResult(
      options.keys,
      overrideValue ? overrideValue[0] : options.defaultValue,
    );

    if (specialData) {
      const slen = specialData.length;
      for (let s = 0; s < slen; s++) {
        createResult(
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

}
