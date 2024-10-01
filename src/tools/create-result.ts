import type { KeyList, Resolved } from '../types/resolver-types';

export function createResult<K extends string, V>(keys: KeyList<K>, value: V, input?: Resolved<K, V>): Resolved<K, V> {
  return keys.reduce((output, key) => {
    return { ...output, [key]: value };
  }, input ?? {} as Resolved<K, V>);
}

export function createResultGetValue<K extends string, V>(keys: KeyList<K>, getValue: (key: K) => V): Resolved<K, V> {
  const entries = keys.map<readonly [K, V]>((key) => {
    const value = getValue(key);
    return [key, value];
  });
  return Object.fromEntries(entries) as Resolved<K, V>;
}
