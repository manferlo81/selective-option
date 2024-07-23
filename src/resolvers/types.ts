import type { InputResolver } from '../types';

export type SpecialKeys<S extends string, K extends string> = Partial<Record<S, K[]>>;

export type KeyResolver<K> = InputResolver<string, [resolved: K[], isSpecial: boolean] | undefined | void>;
