export type Nullish<T = never> = T | null | undefined

export type Dictionary<V, K extends string = string> = Record<K, V>
export type ImmutableDictionary<V, K extends string = string> = Readonly<Dictionary<V, K>>

export type SomeArray<T> = T[] | readonly T[]
export type UnknownArray = SomeArray<unknown>

export type TypeCheckFunction<T> = (value: unknown) => value is T
