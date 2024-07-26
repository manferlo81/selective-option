import type { KeyList, Resolved } from './resolvers/types';

export function createResult<K extends string, V>(keys: KeyList<K>, value: V): Resolved<K, V>;
export function createResult<K extends string, V>(keys: KeyList<K>, value: V, input: Resolved<K, V>): Resolved<K, V>;
export function createResult<K extends string, V>(keys: KeyList<K>, value: V, input?: Resolved<K, V>): Resolved<K, V>;
export function createResult<K extends string, V>(keys: KeyList<K>, value: V, input?: Resolved<K, V>): Resolved<K, V> {
  return keys.reduce((output, key) => {
    return { ...output, [key]: value };
  }, (input || {} as Resolved<K, V>));
}
