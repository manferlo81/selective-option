export type Nullable<T> = T | null | undefined | void;
export type Dictionary<T> = Record<string | number, T>;
export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ObjectSelectiveOptionsKey<K extends string, S extends string> = K | S | 'default';

export type ObjectSelectiveOptions<K extends string, S extends string, T> = Partial<Record<ObjectSelectiveOptionsKey<K, S>, Nullable<T>>>;

export type StringBasedSelectiveOption<K extends string> = K | K[];

export type ObjectBasedSelectiveOption<K extends string, S extends string, T> =
  | Nullable<T>
  | ObjectSelectiveOptions<K, S, T>;

export type SelectiveOption<K extends string, S extends string, T> =
  | StringBasedSelectiveOption<K>
  | ObjectBasedSelectiveOption<K, S, T>;

export type SelectiveResolved<K extends string, T> = Record<K, T>;

export type ResolveFunction<K extends string, S extends string, T> = (
  value: unknown,
  allKeys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<S, K[]>,
  isSpecialKey: TypeCheckFunction<S>,
  isValidValue: TypeCheckFunction<T>,
  defaultValue: T,
) => SelectiveResolved<K, T>;

export type Resolver<K extends string, T> = (value: unknown) => SelectiveResolved<K, T>;
