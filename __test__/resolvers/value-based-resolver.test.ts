import type { FunctionOption, ObjectOption, Resolved } from '../../src'
import { createValueBasedResolver } from '../../src'
import { createExpectedCreator } from '../tools/create-expected'

describe('createValueBasedResolver function', () => {

  const keys = ['node', 'deno', 'chrome', 'firefox'] as const
  const specialKeys = ['server', 'browser'] as const
  const overrideKey = 'override'

  type K = (typeof keys)[number]
  type S = (typeof specialKeys)[number]
  type V = number | null

  const special: Record<S, K[]> = { server: ['node', 'deno'], browser: ['chrome', 'firefox'] }

  const isValidValue = (value: unknown): value is V => value === null || typeof value === 'number'
  const defaultValue: V = 0

  const validValues: V[] = [
    null,
    0,
    1,
    100,
    -100,
    NaN,
    Infinity,
  ]

  const resolve = createValueBasedResolver(
    keys,
    isValidValue,
    defaultValue,
    overrideKey,
    special,
  )

  const createExpected = createExpectedCreator<K, V>((initial) => ({
    node: initial,
    deno: initial,
    chrome: initial,
    firefox: initial,
  }))

  const nullishValues = [
    // null, null is a valid value in this case and doesn't resolve to default value
    undefined,
  ]

  const invalidValues = [
    true,
    false,
    '',
    'string',
    [],
    [true, 'string'],
    validValues, // validValues (not spread) is an array
  ]

  test('Should throw on invalid value', () => {
    invalidValues.forEach((input) => {
      const exec = () => resolve(input as never)
      expect(exec).toThrow()
    })
  })

  test('Should resolve nullish value', () => {
    nullishValues.forEach((input) => {
      const expected = createExpected(defaultValue)
      expect(resolve(input)).toEqual(expected)
    })
  })

  test('Should resolve valid value', () => {
    validValues.forEach((input) => {
      const expected = createExpected(input)
      expect(resolve(input)).toEqual(expected)
    })
  })

  describe('input as a function', () => {

    test('Should throw if input function returns invalid value', () => {
      invalidValues.forEach((invalidValue) => {
        const input = () => invalidValue
        expect(() => resolve(input as never)).toThrow()
      })
    })

    test('Should resolve if input function returns nullish value', () => {
      nullishValues.forEach((nullish) => {
        const input = () => nullish
        const expected = createExpected(defaultValue)
        expect(resolve(input)).toEqual(expected)
      })
    })

    test('Should resolve if input function returns valid value', () => {
      validValues.forEach((value) => {
        const input = () => value
        const expected = createExpected(value)
        expect(resolve(input)).toEqual(expected)
      })
    })

    test('Should resolve using input function', () => {
      interface AdvancedFunctionTestEntry {
        input: FunctionOption<K, V>
        expected: Resolved<K, V>
      }
      const cases: AdvancedFunctionTestEntry[] = [
        { input: (key) => key === 'chrome' ? 20 : 10, expected: createExpected(10, ['chrome'], 20) },
        { input: (key) => key === 'chrome' ? 20 : undefined, expected: createExpected(defaultValue, ['chrome'], 20) },
      ]
      cases.forEach(({ input, expected }) => {
        expect(resolve(input)).toEqual(expected)
      })
    })

  })

  describe('input as an object', () => {

    test('Should resolve object', () => {
      const expected = createExpected(defaultValue)
      expect(resolve({})).toEqual(expected)
    })

    test('Should resolve object with default value', () => {
      validValues.forEach((newDefaultValue) => {
        const expected = createExpected(newDefaultValue)
        expect(resolve({ override: newDefaultValue })).toEqual(expected)
      })
    })

    test('Should resolve object with regular key value', () => {
      keys.forEach((key) => {
        validValues.forEach((input) => {
          const expected = createExpected(defaultValue, [key], input)
          expect(resolve({ [key]: input })).toEqual(expected)
        })
      })
    })

    test('Should resolve object with special key value', () => {
      specialKeys.forEach((specialKey) => {
        validValues.forEach((input) => {
          const expected = createExpected(defaultValue, special[specialKey], input)
          expect(resolve({ [specialKey]: input })).toEqual(expected)
        })
      })
    })

    test('Should resolve valid value before nullish value', () => {
      expect(resolve({ override: null })).toEqual(createExpected(null))
      expect(resolve({ override: undefined })).toEqual(createExpected(defaultValue))
    })

    test('Should resolve advanced input objects', () => {
      interface AdvancedObjectTestCaseEntry {
        input: ObjectOption<K | S | 'override', V>
        expected: Resolved<K, V>
      }
      const cases: AdvancedObjectTestCaseEntry[] = [
        { input: { override: 40, browser: 20 }, expected: createExpected(40, ['chrome', 'firefox'], 20) },
        { input: { browser: 20, override: 40 }, expected: createExpected(40, ['chrome', 'firefox'], 20) },
        { input: { browser: 20, firefox: 15 }, expected: { ...createExpected(defaultValue, ['chrome', 'firefox'], 20), firefox: 15 } },
      ]
      cases.forEach(({ input, expected }) => {
        expect(resolve(input)).toEqual(expected)
      })
    })

  })

})
