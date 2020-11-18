export type Nullable<T> = T | null | undefined | void;
export type Dictionary<V> = Record<string | number, V>;
export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ObjectOption<K extends string, V> = Partial<Record<K | 'default', Nullable<V>>>;

export type StringOption<K extends string> = K | K[];

export type ValueBasedSelectiveOption<K extends string, V> =
  | Nullable<V>
  | ObjectOption<K, V>;

export type BoolBasedSelectiveOption<K extends string, V> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V>;

export type SelectiveResolved<K extends string, V> = Record<K, V>;
