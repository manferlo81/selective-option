export type InputResolver<I, R> = (input: I) => R;
export type ResolverBase<R> = InputResolver<unknown, R>;
export type Resolved<K extends string, V> = Record<K, V>;
export type PotentialResolver<K extends string, V> = ResolverBase<Resolved<K, V> | void>;
export type Resolver<K extends string, V> = ResolverBase<Resolved<K, V>>;
