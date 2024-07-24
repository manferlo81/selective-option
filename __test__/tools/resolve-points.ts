import { createBoolBasedResolver } from '../../src';

export const keys = ['john', 'maggie', 'angel', 'ariel', 'peter', 'gloria'] as const;
export const isKey = (value: unknown): value is K => keys.includes(value as never);
export const literalSizeValues = ['low', 'high', 'unknown'] as const;

export type K = (typeof keys)[number];
export type S = 'male' | 'female' | 'unisex';
export type V = number | (typeof literalSizeValues)[number];
export type R<V> = Readonly<Record<K, V>>;

export const special: Record<S, K[]> = {
  male: ['angel', 'ariel', 'john', 'peter'],
  female: ['angel', 'ariel', 'gloria', 'maggie'],
  unisex: ['angel', 'ariel'],
};
export const specialKeys = Object.keys(special) as readonly S[];

export const isValidSize = (value: unknown): value is V => typeof value === 'number' || literalSizeValues.includes(value as never);
export const defaultValue: V | boolean = 'unknown';

export const createResult = <X extends V | boolean>(value: X): R<X> => {
  return {
    john: value,
    angel: value,
    ariel: value,
    maggie: value,
    peter: value,
    gloria: value,
  };
};

export function extendResult<I extends V | boolean, X extends V | boolean>(result: R<I>, keys: readonly K[], value: X): R<I | X> {
  return keys.reduce((output, key) => {
    return { ...output, [key]: value };
  }, result as R<I | X>);
}

export const resolvePoints = createBoolBasedResolver(
  keys,
  isValidSize,
  defaultValue,
  isKey,
  special,
  'override',
);
