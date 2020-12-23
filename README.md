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

### createBoolResolver

```typescript
function createBoolResolver<K extends string>(
  keys: K[],
): PotentialResolver<K, boolean>;
```

### createNullishResolver

```typescript
function createNullishResolver<K extends string, D>(
  keys: K[],
  defaultValue: D,
): PotentialResolver<K, D>;
```

### createStringResolver

```typescript
function createStringResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean>;
```

### createArrayResolver

```typescript
function createArrayResolver<K extends string>(
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): PotentialResolver<K, boolean>;
```

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

### resolveFailed

```typescript
function resolveFailed(
  value: unknown,
): never;
```

### createResult

```typescript
function createResult<K extends string, V>(
  keys: K[],
  value: V,
  input?: Record<K, V>
): Record<K, V>;
```

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

### resolveValue

```typescript
function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): Record<K, V> | void;
```

### resolveNullish

```typescript
function resolveNullish<K extends string, D>(
  value: unknown,
  keys: K[],
  defaultValue: D,
): Record<K, D> | void;
```

### resolveString

```typescript
function resolveString<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void;
```

### resolveArray

```typescript
function resolveArray<K extends string>(
  value: unknown,
  keys: K[],
  isKey: TypeCheckFunction<K>,
  special?: Nullable<Record<string, K[]>>,
): Record<K, boolean> | void;
```

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

## License

[MIT](LICENSE) &copy; 2020 [Manuel Fernández](https://github.com/manferlo81)
