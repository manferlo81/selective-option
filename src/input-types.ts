import type { AllowNullish } from './helper-types';

export type ObjectOption<K extends string, V, DK extends string = 'default'> = Partial<Record<K | DK, AllowNullish<V>>>;
export type StringOption<K extends string> = K | K[];

export type ValueBasedSelectiveOption<K extends string, V, DK extends string = 'default'> =
  | AllowNullish<V>
  | ObjectOption<K, V, DK>;

export type BoolBasedSelectiveOption<K extends string, V> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V>;
