/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import type { TypeCheckFunction } from '../types/private-types'

interface IsArrayFunction extends TypeCheckFunction<unknown[]>, TypeCheckFunction<readonly unknown[]> {
  <T extends readonly unknown[]>(value: unknown): value is T
  <T extends unknown[]>(value: unknown): value is T
  <T>(value: unknown): value is readonly T[] | T[]
}

interface ExtendedArrayConstructor extends ArrayConstructor {
  isArray: IsArrayFunction
}

export const { isArray } = Array as ExtendedArrayConstructor

export function is(value: unknown, type: 'object'): value is object | null
export function is<T extends object | null | unknown[] | readonly unknown[]>(value: unknown, type: 'object'): value is T
export function is(value: unknown, type: 'function'): value is CallableFunction
export function is<T extends CallableFunction>(value: unknown, type: 'function'): value is T
export function is(value: unknown, type: 'string'): value is string
export function is(value: unknown, type: string): boolean {
  return typeof value === type
}
