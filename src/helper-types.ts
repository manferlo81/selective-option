export type AllowNullish<T> = T | null | undefined | void;
export type TypeCheckFunction<T> = (value: unknown) => value is T;
