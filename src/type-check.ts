import type { TypeCheckFunction } from './helper-types';

interface IsArrayFunction extends TypeCheckFunction<unknown[]> {
  <T extends unknown[]>(value: unknown): value is T;
  <T>(value: unknown): value is T[];
}

interface ExtendedArrayConstructor extends ArrayConstructor {
  isArray: IsArrayFunction;
}

export const { isArray } = Array as ExtendedArrayConstructor;
