import { createResult } from './create-result';
import type { ResolveNullishOptions, SelectiveResolved } from './types';

export function resolveNullish<K extends string, D>(
  value: unknown,
  options: ResolveNullishOptions<K, D>,
): SelectiveResolved<K, D> | void {
  if (value == null) {
    const { keys, defaultValue } = options;
    return createResult(
      keys,
      defaultValue,
    );
  }
}
