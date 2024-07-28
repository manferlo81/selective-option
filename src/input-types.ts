import type { AllowNullish, KeyList, NegateKey } from './private-types';

export type ObjectOption<K extends string, V, O extends string> = Partial<Record<K | O, AllowNullish<V>>>;
export type StringOption<K extends string> = K | NegateKey<K> | KeyList<K | NegateKey<K>>;

export type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | AllowNullish<V>
  | ObjectOption<K, V, O>;

export type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
