import type { AllowNullish, TypeCheckFunction } from './helper-types';

type SpecialKeys<S extends string, K extends string> = Partial<Record<S, K[]>>;

export function resolveKey<K extends string>(
  key: string,
  isKey: TypeCheckFunction<K>,
  special?: AllowNullish<SpecialKeys<string, K>>,
): K[] | void {

  if (isKey(key)) {
    return [key];
  }

  if (!special) return;

  return special[key];

}
