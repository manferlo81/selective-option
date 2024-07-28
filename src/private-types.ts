// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined | Void;
export type AllowNullish<T> = T | Nullish;

export type NegateKey<K extends string> = `!${K}` | `-${K}`;
export type KeyList<K> = readonly K[];
export type SpecialKeys<S extends string, K extends string> = Readonly<Record<S, K[]>>;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
