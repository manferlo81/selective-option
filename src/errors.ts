export const errorInvalidKey = (key: unknown): Error => (
  new Error(`"${key}" is not a valid key`)
);

export const errorInvalidValue = (value: unknown): Error => (
  new Error(`${typeof value === 'string' ? `"${value}"` : value} is not a valid value`)
);
