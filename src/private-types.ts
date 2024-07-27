// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined | Void;
export type AllowNullish<T> = T | Nullish;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
