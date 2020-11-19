import { createResult } from './create-result';
import type { ResolveValueOptions, SelectiveResolved } from './types';

export function resolveValue<K extends string, V>(
  value: unknown,
  options: ResolveValueOptions<K, V>,
): SelectiveResolved<K, V> | void {
  const { keys, isValidValue } = options;
  if (isValidValue(value)) {
    return createResult(
      keys,
      value,
    );
  }
}
