import type { AllowNullish } from '../private-types';
import type { KeyList, SpecialKeys } from '../resolvers/types';

export function resolveKey<K extends string>(key: string, keys: KeyList<K>, special?: AllowNullish<SpecialKeys<string, K>>): K[] | undefined {
  if (keys.includes(key as K)) return [key as K];
  if (!special) return;
  return special[key];
}
