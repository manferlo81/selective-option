import { createBoolBasedResolver } from '../../src';

export const keys = ['circle', 'square', 'oval', 'rectangle', 'hexagon'] as const;
export const isKey = (value: unknown): value is K => keys.includes(value as never);
export const literalSizeValues = ['small', 'random'] as const;

export type K = (typeof keys)[number];
export type S = 'quadrilateral' | 'elliptical' | 'regular';
export type V = number | (typeof literalSizeValues)[number];
export type R<V> = Readonly<Record<K, V>>;

export const special: Record<S, K[]> = {
  quadrilateral: ['rectangle', 'square'],
  elliptical: ['circle', 'oval'],
  regular: ['circle', 'square', 'hexagon'],
};
export const specialKeys = Object.keys(special) as readonly S[];

export const isValidSize = (value: unknown): value is V => typeof value === 'number' || literalSizeValues.includes(value as never);
export const defaultValue: V = 'random';

export const createResult = <X extends V | boolean>(value: X): R<X> => {
  return {
    circle: value,
    oval: value,
    rectangle: value,
    square: value,
    hexagon: value,
  };
};

export function extendResult<I extends V | boolean, X extends V | boolean>(result: R<I>, keys: readonly K[], value: X): R<I | X> {
  return keys.reduce((output, key) => {
    return { ...output, [key]: value };
  }, result as R<I | X>);
}

export const resolveShapeSize = createBoolBasedResolver(
  keys,
  isValidSize,
  defaultValue,
  isKey,
  special,
  'override',
);
