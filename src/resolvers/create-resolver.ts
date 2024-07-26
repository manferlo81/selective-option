import { errorInvalidValue } from '../tools/errors';
import type { PotentialResolver, Resolver } from './types';

export function createResolver<K extends string, V, I = unknown>(...resolvers: Array<PotentialResolver<K, V>>): Resolver<K, V, I>;
export function createResolver<K extends string, V, I = unknown>(...resolvers: Array<PotentialResolver<K, V>>): Resolver<K, V, I> {

  // return resolver
  return (input) => {

    // iterate through resolvers
    for (const resolve of resolvers) {

      // execute resolver
      const result = resolve(input);

      // return result if it's resolved
      if (result) return result;
    }

    // throw Error if input can't be resolved
    throw errorInvalidValue(input);

  };

}
