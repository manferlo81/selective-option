export type Nullish = null | undefined | void;
export type AllowNullish<T> = T | Nullish;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
