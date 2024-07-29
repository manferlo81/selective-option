import type { AllowNullish, KeyList, NegativeKey } from './private-types';

export type SingleKeyOption<K extends string> = K | NegativeKey<K>;
export type KeyListOption<K extends string> = KeyList<SingleKeyOption<K>>;
export type KeyOption<K extends string> = SingleKeyOption<K> | KeyListOption<K>;

export type ObjectOption<K extends string, V> = Partial<Record<K, AllowNullish<V>>>;

export type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | AllowNullish<V>
  | ObjectOption<K | O, V>;

export type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | KeyOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
