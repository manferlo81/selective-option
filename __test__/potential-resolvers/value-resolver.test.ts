import { createValueResolver } from '../../src'
import { createExpectedCreator } from '../tools/create-expected'
import { ArrayItemType } from '../tools/helper-types'

describe('createValueResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const
  const validValues = [true, false, 'auto'] as const
  const defaultValue = 0

  type K = ArrayItemType<typeof keys>
  type V = ArrayItemType<typeof validValues>
  type D = typeof defaultValue

  const isValidValue = (value: unknown): value is V => validValues.includes(value as never)

  const resolve = createValueResolver<K, V, D>(
    keys,
    isValidValue,
    defaultValue,
  )

  const createExpected = createExpectedCreator<K, V | D>((value) => ({
    node: value,
    deno: value,
    chrome: value,
    firefox: value,
  }))

  test('Should not resolve if input is not a valid value', () => {
    const invalidValues = [
      [],
      {},
      0,
      1,
      '',
      'string',
    ]
    invalidValues.forEach((input) => {
      expect(resolve(input)).toBeUndefined()
    })
  })

  test('Should resolve valid value', () => {
    validValues.forEach((input) => {
      const expected = createExpected(input)
      expect(resolve(input)).toEqual(expected)
    })
  })

  test('Should resolve to default value if input is nullish', () => {
    const inputs = [
      null,
      undefined,
    ]
    inputs.forEach((input) => {
      const expected = createExpected(defaultValue)
      expect(resolve(input)).toEqual(expected)
    })
  })

})
