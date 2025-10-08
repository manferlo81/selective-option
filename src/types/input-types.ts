import type { ImmutableDictionary, Nullish } from './helper-types'
import type { NegativeKey, PositiveKey } from './private-types'
import type { KeyList } from './resolver-types'

// Function Option

export type FunctionOption<K extends string, V> = (key: K) => Nullish<V>

// Key Option

export type SingleKeyOption<K extends string> = PositiveKey<K> | NegativeKey<K>
export type KeyListOption<K extends string> = KeyList<SingleKeyOption<K>>
export type KeyOption<K extends string> = SingleKeyOption<K> | KeyListOption<K>

// Object Option

export type ObjectOption<K extends string, V> = Partial<ImmutableDictionary<Nullish<V>, K>>

// Value Based Option

export type ValueBasedSelectiveOption<K extends string, X extends string, V> = Nullish<
  V
  | FunctionOption<K, V>
  | ObjectOption<K | X, V>
>

// Boolean Base Option

export type BoolBasedSelectiveOption<K extends string, S extends string, V, O extends string>
  = | KeyOption<K | S>
    | ValueBasedSelectiveOption<K, S | O, V | boolean>
