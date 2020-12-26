# Selective Option

[![Test and Build](https://github.com/manferlo81/selective-option/workflows/Test%20and%20Build/badge.svg?branch=main)](https://github.com/manferlo81/selective-option/actions) [![codecov](https://codecov.io/gh/manferlo81/selective-option/branch/main/graph/badge.svg?token=U0GIRWISBJ)](https://codecov.io/gh/manferlo81/selective-option)

## Install

```bash
npm i selective-option
```

## API

### createBoolBasedResolver

```typescript
function createBoolBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D | boolean>;
```

### createValueBasedResolver

```typescript
function createValueBasedResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey?: DK,
): Resolver<K, V | D>;
```

### createValueResolver

```typescript
function createValueResolver<K extends string, V>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): PotentialResolver<K, V>;
```

Creates a resolver function that resolves if `isValidValue` returns a truthy value.

### createBoolResolver

```typescript
function createBoolResolver<K extends string>(
  keys: K[],
): PotentialResolver<K, boolean>;
```

Creates a resolver function that resolves if the value is a boolean.

### createNullishResolver

```typescript
function createNullishResolver<K extends string, D>(
  keys: K[],
  defaultValue: D,
): PotentialResolver<K, D>;
```

Creates a resolver function that resolves if the value is `null` or `undefined`.

### createStringResolver

```typescript
function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean>;
```

Creates a resolver function that resolves if the value is a string that satisfies the `isKey` function or is one of the `special` keys.

### createArrayResolver

```typescript
function createArrayResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean>;
```

Creates a resolver function that resolves if the value is an array of string and every string satisfies the `isKey` function or is one of the `special` keys.

### createObjectResolver

```typescript
function createObjectResolver<K extends string, V, D = V, DK extends string = 'default'>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
  defaultKey2?: DK,
): PotentialResolver<K, V | D>;
```

Creates a resolver function that resolves if the value is an object and it follows a valid format.

### resolveFailed

```typescript
function resolveFailed(
  value: unknown,
): never;
```

A function that throws an invalid value error, used internally in `createBoolBasedResolver` and `createValueBasedResolver`.

### createResult

```typescript
function createResult<K extends string, V>(
  keys: K[],
  value: V,
  input?: Record<K, V>
): Record<K, V>;
```

Creates a resolved object result. Used internally in every resolver function.

## Deprecated API

### resolveBoolBased

```typescript
function resolveBoolBased<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): Record<K, V | D | boolean>;
```

Use [`createBoolBasedResolver`](#createboolbasedresolver) instead.

### resolveValueBased

```typescript
function resolveValueBased<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Record<string, K[]>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): Record<K, V | D>;
```

Use [`createValueBasedResolver`](#createvaluebasedresolver) instead.

### resolveValue

```typescript
function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): Record<K, V> | void;
```

Use [`createValueResolver`](#createvalueresolver) instead.

### resolveNullish

```typescript
function resolveNullish<K extends string, D>(
  value: unknown,
  keys: K[],
  defaultValue: D,
): Record<K, D> | void;
```

Use [`createNullishResolver`](#createnullishresolver) instead.

### resolveString

```typescript
function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void;
```

Use [`createStringResolver`](#createstringresolver) instead.

### resolveArray

```typescript
function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void;
```

Use [`createArrayResolver`](#createarrayresolver) instead.

### resolveObject

```typescript
function resolveObject<K extends string, V, D = V>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special: Nullable<Record<string, K[]>>,
  isValidValue: TypeCheckFunction<V>,
  defaultValue: D,
): Record<K, V | D> | void;
```

Use [`createObjectResolver`](#createobjectresolver) instead.

## License

[MIT](LICENSE) &copy; 2020 [Manuel Fernández](https://github.com/manferlo81)
