import type { KeyListOption } from '../../src'
import { createKeyListResolver } from '../../src'
import { createExpectedCreator } from '../tools/create-expected'
import type { ArrayItemType } from '../tools/helper-types'

describe('createKeyListResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const
  const specialKeys = ['server', 'browser'] as const

  type K = ArrayItemType<typeof keys>
  type S = ArrayItemType<typeof specialKeys>

  const special: Record<S, K[]> = { server: ['node', 'deno'], browser: ['chrome', 'firefox'] }

  const resolve = createKeyListResolver<K, S>(
    keys,
    special,
  )

  const createExpected = createExpectedCreator<K, boolean>((value) => {
    return {
      node: value,
      deno: value,
      chrome: value,
      firefox: value,
    }
  })

  const positiveSymbols = ['', '+'] as const
  const negativeSymbols = ['!', '-'] as const

  test('Should not resolve if input is not an array', () => {
    const nonArrayInputs = [
      '',
      'string',
      '0',
      '1',
      true,
      false,
      {},
      setTimeout,
    ]
    nonArrayInputs.forEach((input) => {
      expect(resolve(input)).toBeUndefined()
    })
  })

  test('Should throw if input array has invalid keys', () => {
    const invalid = [
      ['invalid'],
      ['node', true],
      ['node', 10],
      ['! node', 'deno'],
      ['node', '! deno'],
      ['node', 'deno', 'chrome', 'firefox', 'server', 'browser', 'invalid'],
    ]
    invalid.forEach((input) => {
      expect(() => resolve(input)).toThrow()
    })
  })

  test('Should resolve array', () => {
    const expected = createExpected(false)
    expect(resolve([])).toEqual(expected)
  })

  test('Should resolve array with positive keys', () => {
    keys.forEach((key, i, { length }) => {
      const otherKey = keys[(i + 1) % length]
      const doubleKey = [key, otherKey]
      const expected = createExpected(false, doubleKey, true)
      positiveSymbols.forEach((sign) => {
        const input = doubleKey.map((key) => `${sign}${key}`)
        expect(resolve(input)).toEqual(expected)
      })
    })
  })

  test('Should resolve array with negative keys', () => {
    keys.forEach((key, i) => {
      const otherKey = keys[(i + 1) % keys.length]
      const doubleKey = [key, otherKey]
      const expected = createExpected(true, doubleKey, false)
      negativeSymbols.forEach((sign) => {
        const input = doubleKey.map((key) => `${sign}${key}`)
        expect(resolve(input)).toEqual(expected)
      })
    })
  })

  test('Should resolve array with positive special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(false, special[specialKey], true)
      positiveSymbols.forEach((sign) => {
        const input = [`${sign}${specialKey}`]
        expect(resolve(input)).toEqual(expected)
      })
    })
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length]
      const expected = createExpected(false, [...special[specialKey], ...special[otherKey]], true)
      positiveSymbols.forEach((sign) => {
        const input = [specialKey, otherKey].map((key) => `${sign}${key}`)
        expect(resolve(input)).toEqual(expected)
      })
    })
  })

  test('Should resolve array with negative special keys', () => {
    specialKeys.forEach((specialKey) => {
      const expected = createExpected(true, special[specialKey], false)
      negativeSymbols.forEach((negation) => {
        expect(resolve([`${negation}${specialKey}`])).toEqual(expected)
      })
    })
    specialKeys.forEach((specialKey, i) => {
      const otherKey = specialKeys[(i + 1) % specialKeys.length]
      const expected = createExpected(true, [...special[specialKey], ...special[otherKey]], false)
      negativeSymbols.forEach((negation) => {
        const input = [specialKey, otherKey].map((key) => `${negation}${key}`)
        expect(resolve(input)).toEqual(expected)
      })
    })
  })

  test('Should resolve mixed keys', () => {
    const inputs: Array<{ input: KeyListOption<K | S>, expected: ReturnType<typeof createExpected> }> = [
      { input: [], expected: createExpected(false) },
      { input: ['server', '-node'], expected: createExpected(false, ['deno'], true) },
      { input: ['server', '!chrome'], expected: createExpected(false, ['node', 'deno'], true) },
      { input: ['!browser', 'node'], expected: createExpected(false, ['node', 'deno'], true) },
      { input: ['!browser', '+node'], expected: createExpected(false, ['node', 'deno'], true) },
    ]
    inputs.forEach(({ input, expected }) => {
      expect(resolve(input)).toEqual(expected)
    })
  })

})
