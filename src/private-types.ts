// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined | Void;
export type AllowNullish<T> = T | Nullish;

export type KeyResolved<K extends string> = [keys: K[], value: boolean];

export type NegateKey<K extends string> = `!${K}` | `-${K}`;
export type KeyList<K extends string> = readonly K[];
export type SpecialKeys<S extends string, K extends string> = Readonly<Record<S, K[]>>;

export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type InputResolver<I, R> = (input: I) => R;
