import type { AllowNullish } from './private-types';

export type ObjectOption<K extends string, V, O extends string = 'default'> = Partial<Record<K | O, AllowNullish<V>>>;
export type StringOption<K extends string> = K | readonly K[];

export type ValueBasedSelectiveOption<K extends string, V, O extends string = 'default'> =
  | AllowNullish<V>
  | ObjectOption<K, V, O>;

export type BoolBasedSelectiveOption<K extends string, V, O extends string = 'default'> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
