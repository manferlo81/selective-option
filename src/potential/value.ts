import { createResult } from '../tools/create-result'
import { validateValue } from '../tools/value-nullish'
import type { TypeCheckFunction } from '../types/helper-types'
import type { KeyList, PotentialResolver } from '../types/resolver-types'

export function createValueResolver<K extends string, V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): PotentialResolver<K, V>

export function createValueResolver<K extends string, V, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): PotentialResolver<K, V | D>

export function createValueResolver<K extends string, V, D = V>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): PotentialResolver<K, V | D> {

  // return value resolver
  return (input) => {

    // check if value is valid or nullish
    const validated = validateValue(input, isValidValue)

    // exit if value is not valid nor nullish
    if (!validated) return

    // get data from resolved value
    const [isValid, validatedValue] = validated

    // return result using value if it's valid
    if (isValid) return createResult(keys, validatedValue)

    // return result using default value
    return createResult(
      keys,
      defaultValue,
    )

  }

}
