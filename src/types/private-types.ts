import type { KeyList } from './resolver-types'

export type KeyResolved<K extends string> = [resolvedKeys: KeyList<K>, isSpecial: boolean]
export type PolarKeyResolved<K extends string> = [resolvedKeys: KeyList<K>, isPositive: boolean]

export type PositiveKeyPrefix = '+'
export type NegativeKeyPrefix = '!' | '-'
export type PositiveKey<K extends string> = K | `${PositiveKeyPrefix}${K}`
export type NegativeKey<K extends string> = `${NegativeKeyPrefix}${K}`
