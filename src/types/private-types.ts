import type { KeyList } from './resolver-types'

export type Nullish = null | undefined

export type KeyResolved<K extends string> = [resolvedKeys: KeyList<K>, isSpecial: boolean]
export type PolarKeyResolved<K extends string> = [resolvedKeys: KeyList<K>, isPositive: boolean]

export type PositiveKeyPrefix = '+'
export type PositiveKey<K extends string> = K | `${PositiveKeyPrefix}${K}`
export type NegativeKeyPrefix = '!' | '-'
export type NegativeKey<K extends string> = `${NegativeKeyPrefix}${K}`

export type TypeCheckFunction<T> = (value: unknown) => value is T

export type ReadonlyObject<K extends string, V> = Readonly<Record<K, V>>
