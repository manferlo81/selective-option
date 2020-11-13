export function resolveFailed(
  object: unknown,
): never {
  throw new Error(`${object} is not a valid value`);
}
