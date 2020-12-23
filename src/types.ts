export type Nullable<T> = T | null | undefined | void;
export type Dictionary<V> = Record<string | number, V>;
export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ObjectOption<K extends string, V, DK extends string = 'default'> = Partial<Record<K | DK, Nullable<V>>>;

export type StringOption<K extends string> = K | K[];

export type ValueBasedSelectiveOption<K extends string, V, DK extends string = 'default'> =
  | Nullable<V>
  | ObjectOption<K, V, DK>;

export type BoolBasedSelectiveOption<K extends string, V> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V>;

export type ResolverBase<R> = (value: unknown) => R;
export type PotentialResolver<K extends string, V> = ResolverBase<Record<K, V> | void>;
export type Resolver<K extends string, V> = ResolverBase<Record<K, V>>;
