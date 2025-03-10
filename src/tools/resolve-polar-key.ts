import type { AllowNullish, NegativeKeyPrefix, PolarKeyResolved, PositiveKeyPrefix } from '../types/private-types'
import type { KeyList, SpecialKeys } from '../types/resolver-types'
import { is } from './is'
import { resolveKey } from './resolve-key'

const polarityPrefixes = ['!', '+', '-'] as ReadonlyArray<PositiveKeyPrefix | NegativeKeyPrefix>

export function resolvePolarKey<K extends string, S extends string>(key: unknown, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<S, K>>): PolarKeyResolved<K> | undefined {

  // throw if item is not a string
  if (!is(key, 'string')) return

  // try to resolve positive key
  const resolved = resolveKey(key, keys, special)

  // return positive key result if resolved
  if (resolved) {
    const [resolvedKeys] = resolved
    return [resolvedKeys, true]
  }

  // get first character to test for key polarity
  const sign = key.charAt(0)

  // fail if first character in not a polarity prefix
  if (!polarityPrefixes.includes(sign as never)) return

  // get key without polarity
  const absoluteKey = key.slice(1) as K

  // try to resolve key
  const absoluteResolved = resolveKey(absoluteKey, keys, special)

  // fail if it can't be resolved
  if (!absoluteResolved) return

  // return key result with polarity
  const [resolvedKeys] = absoluteResolved
  return [resolvedKeys, sign === '+']

}
