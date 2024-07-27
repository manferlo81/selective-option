import type { KeyList } from './private-types';
import type { Resolved } from './resolvers/types';

export function createResult<K extends string, V>(keys: KeyList<K>, value: V, input?: Resolved<K, V>): Resolved<K, V> {
  return keys.reduce((output, key) => {
    return { ...output, [key]: value };
  }, (input ?? {} as Resolved<K, V>));
}
