import type { BoolBasedSelectiveOption } from '../input-types';
import type { InputResolver, Resolver } from '../types';

export type SpecialKeys<S extends string, K extends string> = Partial<Record<S, K[]>>;

export type KeyResolver<K extends string> = InputResolver<string, K[] | undefined | void>;

export type BoolBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V | boolean, BoolBasedSelectiveOption<K | S, V, O>>;
