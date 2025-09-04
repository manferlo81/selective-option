import type { AllowNullish, NegativeKey, PositiveKey } from './private-types'
import type { KeyList } from './resolver-types'

export type FunctionOption<K extends string, V> = (key: K) => AllowNullish<V>

export type SingleKeyOption<K extends string> = PositiveKey<K> | NegativeKey<K>
export type KeyListOption<K extends string> = KeyList<SingleKeyOption<K>>
export type KeyOption<K extends string> = SingleKeyOption<K> | KeyListOption<K>

export type ObjectOption<K extends string, V> = Partial<Record<K, AllowNullish<V>>>

export type ValueBasedSelectiveOption<K extends string, X extends string, V>
  = | AllowNullish<V>
    | FunctionOption<K, V>
    | ObjectOption<K | X, V>

export type BoolBasedSelectiveOption<K extends string, S extends string, V, O extends string>
  = | KeyOption<K | S>
    | ValueBasedSelectiveOption<K, S | O, V | boolean>
