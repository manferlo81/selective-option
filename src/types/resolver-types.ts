import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from './input-types';
import type { Nullish, ReadonlyObject, Void } from './private-types';

export type KeyList<K extends string> = readonly K[];
export type SpecialKeys<S extends string, K extends string> = ReadonlyObject<S, KeyList<K>>;

export type Resolved<K extends string, V> = ReadonlyObject<K, V>;

export type PotentialResolver<K extends string, V> = (input: unknown) => Resolved<K, V> | Nullish | Void;
export type Resolver<K extends string, V, I = unknown> = (input: I) => Resolved<K, V>;

export type ValueBasedResolver<K extends string, X extends string, V, D = V> = Resolver<K, V | D, ValueBasedSelectiveOption<K, X, V>>;
export type BoolBasedResolver<K extends string, S extends string, V, O extends string, D = V> = Resolver<K, V | D | boolean, BoolBasedSelectiveOption<K, S, V, O>>;
