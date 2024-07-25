import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from '../input-types';

export type KeyList<K> = readonly K[];
export type SpecialKeys<S extends string, K extends string> = Partial<Record<S, K[]>>;

export type InputResolver<I, R> = (input: I) => R;
export type Resolved<K extends string, V> = Readonly<Record<K, V>>;
export type PotentialResolver<K extends string, V> = InputResolver<unknown, Resolved<K, V> | void | undefined>;

export type Resolver<K extends string, V, I = unknown> = InputResolver<I, Resolved<K, V>>;
export type BoolBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V | boolean, BoolBasedSelectiveOption<K | S, V, O>>;
export type ValueBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V | boolean, ValueBasedSelectiveOption<K | S, V, O>>;
