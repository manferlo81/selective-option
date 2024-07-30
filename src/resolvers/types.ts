import type { BoolBasedSelectiveOption, ValueBasedSelectiveOption } from '../input-types';
import type { InputResolver, Void } from '../private-types';

export type Resolved<K extends string, V> = Readonly<Record<K, V>>;
export type PotentialResolver<K extends string, V> = InputResolver<unknown, Resolved<K, V> | Void | undefined>;

export type Resolver<K extends string, V, I = unknown> = InputResolver<I, Resolved<K, V>>;

export type BoolBasedResolver<K extends string, S extends string, V, O extends string, D = V> = Resolver<K, V | D | boolean, BoolBasedSelectiveOption<K | S, V, O>>;
export type ValueBasedResolver<K extends string, X extends string, V, D = V> = Resolver<K, V | D, ValueBasedSelectiveOption<K | X, V>>;
