export function errorInvalidKey(key: unknown): Error {
  return new Error(`"${key}" is not a valid key`);
}

export function errorInvalidValue(value: unknown): Error {
  return new Error(`${typeof value === 'string' ? `"${value}"` : value} is not a valid value`);
}
