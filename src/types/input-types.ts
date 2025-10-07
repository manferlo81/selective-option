import type { NegativeKey, Nullish, PositiveKey } from './private-types'
import type { KeyList } from './resolver-types'

export type FunctionOption<K extends string, V> = (key: K) => V | Nullish

export type SingleKeyOption<K extends string> = PositiveKey<K> | NegativeKey<K>
export type KeyListOption<K extends string> = KeyList<SingleKeyOption<K>>
export type KeyOption<K extends string> = SingleKeyOption<K> | KeyListOption<K>

export type ObjectOption<K extends string, V> = Partial<Record<K, V | Nullish>>

export type ValueBasedSelectiveOption<K extends string, X extends string, V>
  = | V
    | Nullish
    | FunctionOption<K, V>
    | ObjectOption<K | X, V>

export type BoolBasedSelectiveOption<K extends string, S extends string, V, O extends string>
  = | KeyOption<K | S>
    | ValueBasedSelectiveOption<K, S | O, V | boolean>
