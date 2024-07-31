// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined | Void;
export type AllowNullish<T> = T | Nullish;

export type KeyResolved<K extends string> = [keys: K[], isPositive: boolean];

export type PositiveKeyPrefix = '+';
export type PositiveKey<K extends string> = K | `${PositiveKeyPrefix}${K}`;
export type NegativeKeyPrefix = '!' | '-';
export type NegativeKey<K extends string> = `${NegativeKeyPrefix}${K}`;
export type PolarizedKey<K extends string> = PositiveKey<K> | NegativeKey<K>;

export type KeyList<K extends string> = readonly K[];
export type SpecialKeys<S extends string, K extends string> = Readonly<Record<S, K[]>>;

export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type InputResolver<I, R> = (input: I) => R;
