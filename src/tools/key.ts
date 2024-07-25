import type { AllowNullish } from '../private-types';
import type { SpecialKeys } from '../resolvers/types';

export function resolveKey<K extends string>(key: string, keys: readonly K[], special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined {
  if (keys.includes(key as K)) return [key as K];
  if (!special) return;
  return special[key];
}
