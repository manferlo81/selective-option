import { errorInvalidValue } from './errors';
import type { PotentialResolver, Resolver } from './resolvers/types';

export function createResolver<K extends string, V>(...resolvers: Array<PotentialResolver<K, V>>): Resolver<K, V> {
  return (input) => {
    for (const resolve of resolvers) {
      const result = resolve(input);
      if (result) return result;
    }
    throw errorInvalidValue(input);
  };
}
