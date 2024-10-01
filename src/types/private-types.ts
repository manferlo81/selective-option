import type { KeyList } from './resolver-types';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined;
export type AllowNullish<T> = T | Nullish;

export type KeyResolved<K extends string> = [keys: KeyList<K>, isPositive: boolean];

export type PositiveKeyPrefix = '+';
export type PositiveKey<K extends string> = K | `${PositiveKeyPrefix}${K}`;
export type NegativeKeyPrefix = '!' | '-';
export type NegativeKey<K extends string> = `${NegativeKeyPrefix}${K}`;

export type TypeCheckFunction<T> = (value: unknown) => value is T;

export type ReadonlyObject<K extends string, V> = Readonly<Record<K, V>>;
