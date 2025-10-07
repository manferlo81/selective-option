import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from './input-types'
import type { Nullish, ReadonlyObject } from './private-types'

export type KeyList<K extends string> = readonly K[]
export type SpecialKeys<S extends string, K extends string> = ReadonlyObject<S, KeyList<K>>

export type Resolved<K extends string, V> = ReadonlyObject<K, V>

export type PotentiallyResolved<K extends string, V> = Resolved<K, V> | Nullish
export interface PotentialResolver<K extends string, V> {
  (input: unknown): PotentiallyResolved<K, V>
  (input: unknown): void
}

export type Resolver<K extends string, V, I = unknown> = (input: I) => Resolved<K, V>

export type ValueBasedResolver<K extends string, X extends string, V, D = V> = Resolver<K, V | D, ValueBasedSelectiveOption<K, X, V>>
export type BoolBasedResolver<K extends string, S extends string, V, O extends string, D = V> = Resolver<K, V | D | boolean, BoolBasedSelectiveOption<K, S, V, O>>
