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

interface ResolveOptionsBase<K extends string> {
  keys: K[];
}

export interface ResolveValueOptions<K extends string, V> extends
  ResolveOptionsBase<K> {
  isValidValue: TypeCheckFunction<V>;
}

export interface ResolveNullishOptions<K extends string, D> extends
  ResolveOptionsBase<K> {
  defaultValue: D;
}

export interface ResolveStringOptions<K extends string> extends
  ResolveOptionsBase<K> {
  isKey: TypeCheckFunction<K>;
  special?: Nullable<Record<string, K[]>>;
}

export interface ResolveObjectOptions<K extends string, V, D = V> extends
  ResolveValueOptions<K, V>,
  ResolveNullishOptions<K, D>,
  ResolveStringOptions<K> {
}

export type SelectiveResolved<K extends string, V> = Record<K, V>;
