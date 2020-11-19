import { resolveFailed } from './resolve-failed';
import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveValue } from './resolve-value';
import type { ResolveObjectOptions, SelectiveResolved } from './types';

export function resolveValueBased<K extends string, V, D = V>(
  value: unknown,
  options: ResolveObjectOptions<K, V, D>,
): SelectiveResolved<K, V | D> {
  return (
    resolveValue(value, options) ||
    resolveNullish(value, options) ||
    resolveObject(value, options) ||
    resolveFailed(value)
  );
}
