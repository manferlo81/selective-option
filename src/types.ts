/** @deprecated */
export type ResolverBase<R> = InputResolver<unknown, R>;

export type InputResolver<I, R> = (input: I) => R;
export type Resolved<K extends string, V> = Readonly<Record<K, V>>;
export type PotentialResolver<K extends string, V> = InputResolver<unknown, Resolved<K, V> | void | undefined>;
export type Resolver<K extends string, V, I = unknown> = InputResolver<I, Resolved<K, V>>;
