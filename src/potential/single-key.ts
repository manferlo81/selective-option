import { createResult } from '../tools/create-result'
import { resolvePolarKey } from '../tools/resolve-polar-key'
import type { AllowNullish, Nullish } from '../types/private-types'
import type { KeyList, PotentialResolver, SpecialKeys } from '../types/resolver-types'

export function createKeyResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special: SpecialKeys<S, K>,
): PotentialResolver<K, boolean>

export function createKeyResolver<K extends string>(
  keys: KeyList<K>,
  special?: Nullish,
): PotentialResolver<K, boolean>

export function createKeyResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean>

export function createKeyResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: AllowNullish<SpecialKeys<S, K>>,
): PotentialResolver<K, boolean> {

  // return string resolver
  return (input) => {

    // try to resolve value as key or special key
    const resolvedInput = resolvePolarKey(input, keys, special)

    // exit if it can't be resolved
    if (!resolvedInput) return

    // get data from resolved input
    const [resolvedKeys, polarity] = resolvedInput

    // create base result
    const base = createResult(
      keys,
      !polarity,
    )

    // create override result
    const override = createResult(
      resolvedKeys,
      polarity,
    )

    // return result
    return { ...base, ...override }

  }

}
