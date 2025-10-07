import type { KeyResolved, Nullish } from '../types/private-types'
import type { KeyList, SpecialKeys } from '../types/resolver-types'

export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special: Partial<SpecialKeys<string, K>> | Nullish): KeyResolved<K> | undefined {
  if (keys.includes(key as never)) return [[key as K], false]
  if (!special) return
  const specialResolved = special[key]
  if (!specialResolved) return
  return [specialResolved, true]
}
