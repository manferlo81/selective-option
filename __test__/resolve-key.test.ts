import { resolveKey } from '../src/tools/resolve-key'

describe('resolveKey function', () => {

  const keys = ['red', 'green', 'blue', 'white', 'black'] as const
  const specialKeys = ['mono', 'color'] as const

  type Color = (typeof keys)[number]
  type SpecialColor = (typeof specialKeys)[number]

  const special: Record<SpecialColor, Color[]> = {
    mono: ['white', 'black'],
    color: ['red', 'green', 'blue'],
  }

  const resolveRegular = (key: string) => resolveKey(key, keys, null)
  const resolve = (key: string) => resolveKey(key, keys, special)

  test('Should resolve regular key', () => {
    keys.forEach((key) => {
      const expected = [[key], false]
      expect(resolveRegular(key)).toEqual(expected)
      expect(resolve(key)).toEqual(expected)
    })
  })

  test('Should resolve special key', () => {
    specialKeys.forEach((specialKey) => {
      const expected = [special[specialKey], true]
      expect(resolve(specialKey)).toEqual(expected)
      expect(resolveRegular(specialKey)).toBeUndefined()
    })
  })

  test('Should return undefined if key not found', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
      ...specialKeys,
    ]
    invalidKeys.forEach((invalidKey) => {
      expect(resolveRegular(invalidKey)).toBeUndefined()
    })
  })

  test('Should return undefined if special key not found', () => {
    const invalidKeys = [
      'orange',
      'string',
      'anything',
    ]
    invalidKeys.forEach((invalidKey) => {
      expect(resolve(invalidKey)).toBeUndefined()
    })
  })

  test('Should return undefined if key is invalid', () => {
    const invalidKeys = [
      0,
      1,
      true,
      false,
    ]
    invalidKeys.forEach((invalidKey) => {
      const resolved = resolve(invalidKey as never)
      expect(resolved).toBeUndefined()
    })
  })

})
