import type { AllowNullish, KeyResolved } from '../types/private-types'
import type { KeyList, SpecialKeys } from '../types/resolver-types'

export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special: AllowNullish<Partial<SpecialKeys<string, K>>>): KeyResolved<K> | undefined {
  if (keys.includes(key as never)) return [[key as K], false]
  if (!special) return
  const specialResolved = special[key]
  if (!specialResolved) return
  return [specialResolved, true]
}
