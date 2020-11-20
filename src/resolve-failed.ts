import { errorInvalidValue } from './errors';

export function resolveFailed(
  value: unknown,
): never {
  throw errorInvalidValue(value);
}
