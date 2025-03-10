import { createResultGetValue } from '../tools/create-result'
import { is } from '../tools/is'
import { validateValueOrThrow } from '../tools/value-nullish'
import type { FunctionOption } from '../types/input-types'
import type { TypeCheckFunction } from '../types/private-types'
import type { KeyList, PotentialResolver } from '../types/resolver-types'

export function createFunctionResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): PotentialResolver<K, V>

export function createFunctionResolver<K extends string, V, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): PotentialResolver<K, V | D>

export function createFunctionResolver<K extends string, V, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): PotentialResolver<K, V | D> {

  // return function resolver
  return (input) => {

    // exit if input is not a function
    if (!is<FunctionOption<K, V>>(input, 'function')) return

    const getValue = (key: K) => {

      // get value from input
      const value = input(key)

      // get data from value if it's valid or nullish
      const [isValid, validatedValue] = validateValueOrThrow(value, isValidValue)

      // return value if it's valid
      if (isValid) return validatedValue

      // return default value if value is nullish
      return defaultValue

    }

    // return result
    return createResultGetValue(
      keys,
      getValue,
    )

  }

}
