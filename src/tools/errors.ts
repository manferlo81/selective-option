import { is } from './is';

export function errorInvalidKey(key: unknown): Error {
  return new Error(`"${key as never}" is not a valid key`);
}

export function errorInvalidValue(value: unknown): Error {
  const formattedValue = is(value, 'string') ? `"${value}"` : value;
  return new Error(`${formattedValue as never} is not a valid value`);
}
