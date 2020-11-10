export type Nullable<T> = T | null | undefined | void;
export type Dictionary<T> = Record<string | number, T>;
export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ObjectOptionKey<K extends string, S extends string> = K | S | 'default';
export type ObjectOption<K extends string, S extends string, T> = Partial<Record<ObjectOptionKey<K, S>, Nullable<T>>>;

export type StringOption<K extends string> = K | K[];

export type ValueBasedSelectiveOption<K extends string, S extends string, T> =
  | Nullable<T>
  | ObjectOption<K, S, T>;

export type BoolBasedSelectiveOption<K extends string, S extends string, T> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, S, T>;

export type SelectiveResolved<K extends string, T> = Record<K, T>;
