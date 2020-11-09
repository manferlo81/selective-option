import type { Dictionary } from './types';

export function isObject(value: unknown): value is Dictionary<unknown> | unknown[] {
  return !!value && typeof value === 'object';
}

export const { isArray } = Array;
