import type { TypeCheckFunction } from './helper-types';

interface IsArrayFunction extends TypeCheckFunction<unknown[]>, TypeCheckFunction<readonly unknown[]> {
  <T extends unknown[]>(value: unknown): value is T;
  <T extends readonly unknown[]>(value: unknown): value is T;
  <T>(value: unknown): value is T[] | readonly T[];
}

interface ExtendedArrayConstructor extends ArrayConstructor {
  isArray: IsArrayFunction;
}

export const { isArray } = Array as ExtendedArrayConstructor;

export function is<T extends object | null | unknown[] | readonly unknown[]>(value: unknown, type: 'object'): value is T;
export function is(value: unknown, type: 'string'): value is string;
export function is(value: unknown, type: string): boolean {
  return typeof value === type;
}
