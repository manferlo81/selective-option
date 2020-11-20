import { createResult } from './create-result';
import type { ResolveValueOptions, SelectiveResolved } from './types';

export function resolveValue<K extends string, V>(
  value: unknown,
  options: ResolveValueOptions<K, V>,
): SelectiveResolved<K, V> | void {
  if (options.isValidValue(value)) {
    return createResult(
      options.keys,
      value,
    );
  }
}
