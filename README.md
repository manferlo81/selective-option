# Selective Option

[![CI](https://github.com/manferlo81/selective-option/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/manferlo81/selective-option/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/manferlo81/selective-option/branch/main/graph/badge.svg?token=U0GIRWISBJ)](https://codecov.io/gh/manferlo81/selective-option)

## In this page

* [Install](#install)
* [API](#api)
  * Resolvers
    * *function* [`createValueBasedResolver`](#function-createvaluebasedresolver)
    * *function* [`createBoolBasedResolver`](#function-createboolbasedresolver)
  * Potential Resolvers
    * *function* [`createValueResolver`](#function-createvalueresolver)
    * *function* [`createStringResolver`](#function-createstringresolver)
    * *function* [`createArrayResolver`](#function-createarrayresolver)
    * *function* [`createObjectResolver`](#function-createobjectresolver)
  * Others
    * *function* [`createResolver`](#function-createresolver)
    * *function* [`createResult`](#function-createresult)
* [Exported Types](#exported-types)
  * Input Types
    * *type* [`StringOption`](#type-stringoption)
    * *type* [`ObjectOption`](#type-objectoption)
    * *type* [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption)
    * *type* [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption)
  * Resolver Types
    * *type* [`Resolved`](#type-resolved)
    * *type* [`InputResolver`](#type-inputresolver)
    * *type* [`PotentialResolver`](#type-potentialresolver)
    * *type* [`Resolver`](#type-resolver)
    * *type* [`ValueBasedResolver`](#type-valuebasedresolver)
    * *type* [`BoolBasedResolver`](#type-boolbasedresolver)
* [Other Types](#other-types)
  * *type* [`KeyList`](#type-keylist)
  * *type* [`SpecialKeys`](#type-specialkeys)
  * *type* [`TypeCheckFunction`](#type-typecheckfunction)

## Install

```bash
npm install selective-option
```

## API

### *function* `createValueBasedResolver`

```typescript
function createValueBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: SpecialKeys<S, K> | null | undefined,
): ValueBasedResolver<K, S, V, O>;
```

See [`TypeCheckFunction`](#type-typecheckfunction), [`SpecialKeys`](#type-specialkeys) and [`ValueBasedResolver`](#type-valuebasedresolver).

### *function* `createBoolBasedResolver`

```typescript
function createBoolBasedResolver<K extends string, S extends string, V, O extends string>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V> | null | undefined,
  defaultValue: V | boolean,
  overrideKey: O,
  special?: SpecialKeys<S, K> | null | undefined,
): BoolBasedResolver<K, S, V | boolean, O>;
```

See [`TypeCheckFunction`](#type-typecheckfunction), [`SpecialKeys`](#type-specialkeys) and [`BoolBasedResolver`](#type-boolbasedresolver).

### *function* `createValueResolver`

Creates a `potential resolver` function that resolves to the `input value` if it satisfies `isValidValue` function, or `defaultValue` if input is nullish. It returns undefined otherwise.

```typescript
function createValueResolver<K extends string, V>(
  keys: readonly K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
): PotentialResolver<K, V>;
```

See [`TypeCheckFunction`](#type-typecheckfunction) and [`PotentialResolver`](#type-potentialresolver).

### *function* `createStringResolver`

Creates a `potential resolver` function that resolves if the `input value` is a `string` that satisfies the `isKey` function, or if it is one of the `special` object keys. It returns undefined otherwise.

```typescript
function createStringResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: SpecialKeys<S, K> | null | undefined,
): PotentialResolver<K, boolean>;
```

See [`KeyList`](#type-keylist), [`SpecialKeys`](#type-specialkeys) and [`PotentialResolver`](#type-potentialresolver).

### *function* `createArrayResolver`

Creates a `potential resolver` function that resolves if the `input value` is an `array of string` and every string satisfies the `isKey` function, or if it is one of the `special` object keys. It returns undefined otherwise.

```typescript
function createArrayResolver<K extends string, S extends string>(
  keys: KeyList<K>,
  special?: SpecialKeys<S, K> | null | undefined,
): PotentialResolver<K, boolean>;
```

See [`KeyList`](#type-keylist), [`SpecialKeys`](#type-specialkeys) and [`PotentialResolver`](#type-potentialresolver).

### *function* `createObjectResolver`

Creates a resolver function that resolves if the `input value` is an `object` and it follows a valid format.

```typescript
function createObjectResolver<K extends string, S extends string, V, O extends string>(
  keys: KeyList<K>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: V,
  overrideKey: O,
  special?: SpecialKeys<S, K> | null | undefined,
): PotentialResolver<K, V>;
```

See [`KeyList`](#type-keylist), [`TypeCheckFunction`](#type-typecheckfunction), [`SpecialKeys`](#type-specialkeys) and [`PotentialResolver`](#type-potentialresolver).

### *function* `createResolver`

Creates a resolver base on a series of `potential resolvers`. I will iterate through every `potential resolver` until one resolves and return the resolved result. It will `throw` if no `potential resolver` resolves.

```typescript
function createResolver<K extends string, V, I = unknown>(
  ...resolvers: Array<PotentialResolver<K, V>>
): Resolver<K, V, I>;
```

See [`PotentialResolver`](#type-potentialresolver) and [`Resolver`](#type-resolver).

### *function* `createResult`

Creates a `resolved object`. Used internally in every potential resolver function. It is exported in case you need to write your own potential resolver.

```typescript
function createResult<K extends string, V>(
  keys: KeyList<K>,
  value: V,
  input?: Resolved<K, V>
): Resolved<K, V>;
```

See [`KeyList`](#type-keylist) and [`Resolved`](#type-resolved).

## Exported Types

### *type* `StringOption`

```typescript
export type StringOption<K extends string> = K | KeyList<K>;
```

See [`KeyList`](#type-keylist). Used in *type* [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption).

### *type* `ObjectOption`

```typescript
export type ObjectOption<K extends string, V, O extends string> = Partial<Record<K | O, V | null | undefined>>;
```

Used in *type* [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption).

### *type* `ValueBasedSelectiveOption`

```typescript
export type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | V
  | null
  | undefined
  | ObjectOption<K, V, O>;
```

See [`ObjectOption`](#type-objectoption). Used in *type* [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption) and [`ValueBasedResolver`](#type-valuebasedresolver).

### *type* `BoolBasedSelectiveOption`

```typescript
export type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
```

See [`StringOption`](#type-stringoption) and [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption). Used in *type* [`BoolBasedResolver`](#type-boolbasedresolver).

### *type* `Resolved`

```typescript
export type Resolved<K extends string, V> = Readonly<Record<K, V>>;
```

Used in *function* [`createResult`](#function-createresult) and *type* [`PotentialResolver`](#type-potentialresolver), [`Resolver`](#type-resolver).

### *type* `InputResolver`

```typescript
export type InputResolver<I, R> = (input: I) => R;
```

Used in *type* [`PotentialResolver`](#type-potentialresolver) and [`Resolver`](#type-resolver).

### *type* `PotentialResolver`

```typescript
export type PotentialResolver<K extends string, V> = InputResolver<unknown, Resolved<K, V> | void | undefined>;
```

See [`InputResolver`](#type-inputresolver) and [`Resolved`](#type-resolved). Used in *function* [`createValueResolver`](#function-createvalueresolver), [`createStringResolver`](#function-createstringresolver), [`createArrayResolver`](#function-createarrayresolver), [`createObjectResolver`](#function-createobjectresolver) and [`createResolver`](#function-createresolver).

### *type* `Resolver`

```typescript
export type Resolver<K extends string, V, I = unknown> = InputResolver<I, Resolved<K, V>>;
```

See [`InputResolver`](#type-inputresolver) and [`Resolved`](#type-resolved). Used in *function* [`createResolver`](#function-createresolver) and *type* [`ValueBasedResolver`](#type-valuebasedresolver) and [`BoolBasedResolver`](#type-boolbasedresolver).

### *type* `ValueBasedResolver`

```typescript
export type ValueBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V, ValueBasedSelectiveOption<K | S, V, O>>;
```

See [`Resolver`](#type-resolver) and [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption). Used in *function* [`createValueBasedResolver`](#function-createvaluebasedresolver).

### *type* `BoolBasedResolver`

```typescript
export type BoolBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V | boolean, BoolBasedSelectiveOption<K | S, V, O>>;
```

See [`Resolver`](#type-resolver) and [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption). Used in *function* [`createBoolBasedResolver`](#function-createboolbasedresolver).

## Other Types

### *type* `KeyList`

```typescript
type KeyList<K> = readonly K[];
```

Used in *function* [`createStringResolver`](#function-createstringresolver), [`createArrayResolver`](#function-createarrayresolver), [`createObjectResolver`](#function-createobjectresolver), [`createResult`](#function-createresult) and *type* [`StringOption`](#type-stringoption).

### *type* `SpecialKeys`

```typescript
type SpecialKeys<S extends string, K extends string> = Readonly<Record<S, K[]>>;
```

Used in *function* [`createValueBasedResolver`](#function-createvaluebasedresolver), [`createBoolBasedResolver`](#function-createboolbasedresolver), [`createStringResolver`](#function-createstringresolver), [`createArrayResolver`](#function-createarrayresolver) and [`createObjectResolver`](#function-createobjectresolver).

### *type* `TypeCheckFunction`

```typescript
type TypeCheckFunction<V> = (input: unknown) => input is V;
```

Used in *function* [`createValueBasedResolver`](#function-createvaluebasedresolver), [`createBoolBasedResolver`](#function-createboolbasedresolver), [`createValueResolver`](#function-createvalueresolver) and [`createObjectResolver`](#function-createobjectresolver).

## License

[MIT](LICENSE) &copy; 2020-2024 [Manuel Fernández](https://github.com/manferlo81)
