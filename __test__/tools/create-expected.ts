import type { KeyList } from '../../src'

type CreateInitial<K extends string, B> = <V extends B>(initialValue: V) => Record<K, V>

interface CreateExpected<K extends string, B> extends CreateInitial<K, B> {
  <V extends B>(initialValue: B, keys: KeyList<K>, value: V): Record<K, V>
}

export function createExpectedCreator<K extends string, B>(createInitial: CreateInitial<K, B>): CreateExpected<K, B>
export function createExpectedCreator<K extends string, B>(createInitial: CreateInitial<K, B>): CreateExpected<K, B> {
  return <V extends B>(initialValue: V, keys?: KeyList<K>, value?: V) => {
    const initial = createInitial(initialValue)
    if (!keys) return initial
    return keys.reduce((output, key) => {
      return { ...output, [key]: value as V }
    }, initial)
  }
}
