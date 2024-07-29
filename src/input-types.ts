import type { AllowNullish, KeyList, NegateKey } from './private-types';

export type SingleKeyOption<K extends string> = K | NegateKey<K>;
export type KeyListOption<K extends string> = KeyList<SingleKeyOption<K>>;
export type KeyOption<K extends string> = SingleKeyOption<K> | KeyListOption<K>;

export type ObjectOption<K extends string, V, O extends string> = Partial<Record<K | O, AllowNullish<V>>>;

export type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | AllowNullish<V>
  | ObjectOption<K, V, O>;

export type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | KeyOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
