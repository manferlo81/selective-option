import type { KeyList, Resolved } from '../types/resolver-types'

export function createResult<K extends string, V>(keys: KeyList<K>, value: V): Resolved<K, V> {
  const entries = keys.map<readonly [K, V]>((key) => {
    return [key, value]
  })
  return Object.fromEntries(entries) as Resolved<K, V>
}

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures
export function deprecatedCreateResult<K extends string, V>(keys: KeyList<K>, value: V, input: undefined | Resolved<K, V>): Resolved<K, V>

export function deprecatedCreateResult<K extends string, V>(keys: KeyList<K>, value: V): Resolved<K, V>
export function deprecatedCreateResult<K extends string, V>(keys: KeyList<K>, value: V, input?: Resolved<K, V>): Resolved<K, V> {
  const result = createResult(keys, value)
  return { ...input, ...result }
}

export function createResultGetValue<K extends string, V>(keys: KeyList<K>, getValue: (key: K) => V): Resolved<K, V> {
  const entries = keys.map<readonly [K, V]>((key) => {
    const value = getValue(key)
    return [key, value]
  })
  return Object.fromEntries(entries) as Resolved<K, V>
}
