# Selective Option

[![CI](https://github.com/manferlo81/selective-option/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/manferlo81/selective-option/actions/workflows/ci.yml)
[![NPM Version](https://badgen.net/npm/v/selective-option)](https://www.npmjs.com/package/selective-option)
[![install size](https://packagephobia.com/badge?p=selective-option)](https://packagephobia.com/result?p=selective-option)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/selective-option/badge?style=rounded)](https://www.jsdelivr.com/package/npm/selective-option)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/manferlo81/selective-option)](https://libraries.io/npm/selective-option)
[![Codecov](https://codecov.io/gh/manferlo81/selective-option/branch/main/graph/badge.svg?token=U0GIRWISBJ)](https://codecov.io/gh/manferlo81/selective-option)
[![Known Vulnerabilities](https://snyk.io/test/github/manferlo81/selective-option/badge.svg)](https://snyk.io/test/github/manferlo81/selective-option)

## In this page

* [Install](#install)
  * [npm](#npm)
  * [yarn](#yarn)
  * [pnpm](#pnpm)
* [CDN](#cdn)
  * [jsDelivr](#jsdelivr)
  * [unpkg](#unpkg)
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

### npm

```bash
npm install selective-option
```

### yarn

```bash
yarn add selective-option
```

### pnpm

```bash
pnpm add selective-option
```

## CDN

### jsDelivr

* ***UMD***

```html
<script src="https://cdn.jsdelivr.net/npm/selective-option@latest/dist/umd/selective.umd.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/selective-option@latest/dist/umd/selective.umd.min.js"></script>
```

* ***ES Module***

```html
<script type="module">
  import selective from "https://cdn.jsdelivr.net/npm/selective-option@latest/dist/esm/selective.mjs";
</script>
```

```html
<script type="module">
  import selective from "https://cdn.jsdelivr.net/npm/selective-option@latest/dist/esm/selective.min.mjs";
</script>
```

[*more options...*](https://www.jsdelivr.com/package/npm/selective-option?version=latest)

### unpkg

* ***UMD***

```html
<script src="https://unpkg.com/selective-option@latest/dist/umd/selective.umd.js"></script>
```

```html
<script src="https://unpkg.com/selective-option@latest/dist/umd/selective.umd.min.js"></script>
```

* ***ES Module***

```html
<script type="module">
  import selective from "https://unpkg.com/selective-option@latest/dist/esm/selective.mjs";
</script>
```

```html
<script type="module">
  import selective from "https://unpkg.com/selective-option@latest/dist/esm/selective.min.mjs";
</script>
```

[*more options...*](https://unpkg.com/selective-option@latest/)

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

* *Example*

```typescript
const resolveNumber = createValueBasedResolver(
  ['a', 'b', 'c'] as const,
  (value: unknown): value is number => typeof value === 'number',
  0,
  'override',
  { ac: ['a', 'c'] },
);

resolveNumber(18); // set value { a: 18, b: 18, c: 18 }
resolveNumber(true); // Throws because true doesn't pass the test
resolveNumber({}); // default value { a: 0, b: 0, c: 0 }
resolveNumber({ override: 40 }); // overridden value { a: 40, b: 40, c: 40 }
resolveNumber({ override: 'string' }); // Throws because 'string' doesn't pass the test
resolveNumber({ b: 40 }); // default + set value { a: 0, b: 40 c: 0 }
resolveNumber({ c: [] }); // Throws because [] doesn't pass the test
resolveNumber({ ac: 40 }); // default + special set value { a: 40, b: 0 c: 40 }
resolveNumber({ override: 40, a: 12 }); // overridden + set value { a: 12, b: 40, c: 40 }
resolveNumber({ override: 40, ac: 12 }); // overridden + special set value { a: 12, b: 40, c: 12 }
// ... you get the idea...
```

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

* *Example*

```typescript
const resolve = createBoolBasedResolver(
  ['a', 'b', 'c'] as const,
  (value: unknown): value is ('yes' | 'not' | 'unknown') => {
    return ['yes', 'no', 'unknown'].includes(value as never);
  },
  'unknown',
  'default',
  { ab: ['a', 'b'] },
);

resolveEvenNumber(null); // default value { a: 'unknown', b: 'unknown', c: 'unknown' }
resolveEvenNumber('yes'); // set value { a: 'yes', b: 'yes', c: 'yes' }
resolveEvenNumber(17); // Throws because 17 doesn't pass the test
resolveEvenNumber('a'); // set key { a: true, b: false, c: false }
resolveEvenNumber('ab'); // set key { a: true, b: true, c: false }
resolveEvenNumber(['a', 'c']); // set key { a: true, b: false, c: true }
resolveEvenNumber(['a', 'b', 'c']); // set key { a: true, b: true, c: true }
resolveEvenNumber(['ab', 'c']); // set key { a: true, b: true, c: true }
resolveEvenNumber({}); // default value { a: 'unknown', b: 'unknown', c: 'unknown' }
resolveEvenNumber({ default: true }); // overridden value { a: true, b: true, c: true }
resolveEvenNumber({ default: 15 }); // Throws because 15 doesn't pass the test
resolveEvenNumber({ default: 'yes', a: true }); // overridden + set value { a: true, b: 'yes', c: 'yes' }
// ... you get the idea...
```

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

* *Example*

```typescript
createResult(['a', 'b', 'c'], true); // { a: true, b: true, c: true }
createResult(['a', 'b', 'c'], 10); // { a: 10, b: 10, c: 10 }
```

* *Example*

```typescript
const base = createResult(['a', 'b', 'c'], 0); // base = { a: 0, b: 0, c: 0 }
createResult(['a', 'c'], 40, base); // { a: 40, b: 0, c: 40 }
createResult(['a', 'b'], 20, base); // { a: 20, b: 20, c: 0 }
```

## Exported Types

### *type* `StringOption`

```typescript
type StringOption<K extends string> = K | KeyList<K>;
```

See [`KeyList`](#type-keylist). Used in *type* [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption).

### *type* `ObjectOption`

```typescript
type ObjectOption<K extends string, V, O extends string> = Partial<Record<K | O, V | null | undefined>>;
```

Used in *type* [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption).

### *type* `ValueBasedSelectiveOption`

```typescript
type ValueBasedSelectiveOption<K extends string, V, O extends string> =
  | V
  | null
  | undefined
  | ObjectOption<K, V, O>;
```

See [`ObjectOption`](#type-objectoption). Used in *type* [`BoolBasedSelectiveOption`](#type-boolbasedselectiveoption) and [`ValueBasedResolver`](#type-valuebasedresolver).

### *type* `BoolBasedSelectiveOption`

```typescript
type BoolBasedSelectiveOption<K extends string, V, O extends string> =
  | StringOption<K>
  | ValueBasedSelectiveOption<K, V | boolean, O>;
```

See [`StringOption`](#type-stringoption) and [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption). Used in *type* [`BoolBasedResolver`](#type-boolbasedresolver).

### *type* `Resolved`

```typescript
type Resolved<K extends string, V> = Readonly<Record<K, V>>;
```

Used in *function* [`createResult`](#function-createresult) and *type* [`PotentialResolver`](#type-potentialresolver), [`Resolver`](#type-resolver).

### *type* `InputResolver`

```typescript
type InputResolver<I, R> = (input: I) => R;
```

Used in *type* [`PotentialResolver`](#type-potentialresolver) and [`Resolver`](#type-resolver).

### *type* `PotentialResolver`

```typescript
type PotentialResolver<K extends string, V> = InputResolver<unknown, Resolved<K, V> | void | undefined>;
```

See [`InputResolver`](#type-inputresolver) and [`Resolved`](#type-resolved). Used in *function* [`createValueResolver`](#function-createvalueresolver), [`createStringResolver`](#function-createstringresolver), [`createArrayResolver`](#function-createarrayresolver), [`createObjectResolver`](#function-createobjectresolver) and [`createResolver`](#function-createresolver).

### *type* `Resolver`

```typescript
type Resolver<K extends string, V, I = unknown> = InputResolver<I, Resolved<K, V>>;
```

See [`InputResolver`](#type-inputresolver) and [`Resolved`](#type-resolved). Used in *function* [`createResolver`](#function-createresolver) and *type* [`ValueBasedResolver`](#type-valuebasedresolver) and [`BoolBasedResolver`](#type-boolbasedresolver).

### *type* `ValueBasedResolver`

```typescript
type ValueBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V, ValueBasedSelectiveOption<K | S, V, O>>;
```

See [`Resolver`](#type-resolver) and [`ValueBasedSelectiveOption`](#type-valuebasedselectiveoption). Used in *function* [`createValueBasedResolver`](#function-createvaluebasedresolver).

### *type* `BoolBasedResolver`

```typescript
type BoolBasedResolver<K extends string, S extends string, V, O extends string> = Resolver<K, V | boolean, BoolBasedSelectiveOption<K | S, V, O>>;
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

[MIT](LICENSE) &copy; 2020-2024 [Manuel Fernández](https://github.com/manferlo81) (@manferlo81)
