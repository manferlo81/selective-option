export type Nullable<T> = T | null | undefined | void;
export type Dictionary<V> = Record<string | number, V>;
export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ObjectOptionKey<K extends string, SK extends string, DK extends string> = K | SK | DK;
export type ObjectOption<K extends string, SK extends string, V> = Partial<Record<ObjectOptionKey<K, SK, 'default'>, Nullable<V>>>;

export type StringOption<K extends string> = K | K[];

export type ValueBasedSelectiveOption<K extends string, SK extends string, V> =
  | Nullable<V>
  | ObjectOption<K, SK, V>;

export type BoolBasedSelectiveOption<K extends string, SK extends string, V> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, SK, V>;

export type SelectiveResolved<K extends string, V> = Record<K, V>;
