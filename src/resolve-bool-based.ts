import { resolveFailed } from './resolve-failed';
import { resolveNullish } from './resolve-nullish';
import { resolveObject } from './resolve-object';
import { resolveArray, resolveString } from './resolve-strings';
import { resolveValue } from './resolve-value';
import type { ResolveObjectOptions, SelectiveResolved } from './types';

export function resolveBoolBased<K extends string, V, D = V>(
  value: unknown,
  options: ResolveObjectOptions<K, V | boolean, D>,
): SelectiveResolved<K, V | D | boolean> {
  return (
    resolveValue(value, options) ||
    resolveNullish(value, options) ||
    resolveString(value, options) ||
    resolveArray(value, options) ||
    resolveObject(value, options) ||
    resolveFailed(value)
  );
}
