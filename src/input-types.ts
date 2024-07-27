import type { AllowNullish, KeyList } from './private-types';

export type ObjectOption<K extends string, V, O extends string> = Partial<Record<K | O, AllowNullish<V>>>;
export type StringOption<K extends string> = K | KeyList<K>;

export type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | AllowNullish<V>
  | ObjectOption<K, V, O>;

export type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
