# Problem 3 — Bug & Anti-pattern Report

## Bugs (will cause incorrect behaviour or runtime errors)

### 1. `lhsPriority` is never declared — ReferenceError at runtime

**Location:** `original.tsx` filter callback

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // ❌ lhsPriority does not exist
```

`balancePriority` is computed but `lhsPriority` is used instead.
This throws a `ReferenceError` the moment the filter runs, crashing the component.

**Fix:** Replace `lhsPriority` with `balancePriority`.

---

### 2. Filter logic is inverted — keeps zero/negative balances

**Location:** `original.tsx` filter callback

```ts
if (balance.amount <= 0) {
  return true; // ❌ keeps wallets with nothing or negative amounts
}
```

A wallet page should display balances with a **positive** amount. The condition is backwards.

**Fix:** `balance.amount > 0`

---

### 3. `WalletBalance` interface is missing the `blockchain` field

**Location:** `original.tsx` interface definition

```ts
interface WalletBalance {
  currency: string;
  amount: number;
  // ❌ blockchain is accessed everywhere but never declared
}
```

TypeScript does not catch this only because `getPriority` accepts `any`. At runtime `balance.blockchain` resolves correctly (assuming the API returns it), but the type contract is broken and the compiler provides no safety net.

**Fix:** Add `blockchain: string` to `WalletBalance`.

---

### 4. `rows` maps `sortedBalances` but casts each element as `FormattedWalletBalance`

**Location:** `original.tsx` rows declaration

```ts
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  ...
  formattedAmount={balance.formatted} // ❌ undefined — sortedBalances has no `formatted` field
```

`sortedBalances` contains `WalletBalance` objects. The `FormattedWalletBalance` type cast fools the compiler, but `balance.formatted` is `undefined` at runtime so every row renders with a missing formatted amount.

**Fix:** Merge the format step into `sortedBalances` (inside `useMemo`) so every item carries the `formatted` field before the map.

---

### 5. Sort comparator returns `undefined` for equal priorities

**Location:** `original.tsx` sort callback

```ts
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// ❌ falls through and implicitly returns undefined
```

The `Array.prototype.sort` contract requires the comparator to return a **number** for every pair. Returning `undefined` produces engine-specific undefined behaviour (wrong order, or errors in strict engines).

**Fix:** Return `rhs.priority - lhs.priority` as a single expression — handles all three cases and is shorter.

---

## Computational Inefficiencies

### 6. `getPriority` called O(n log n) times instead of O(n)

**Location:** `original.tsx` sort callback

```ts
.sort((lhs, rhs) => {
  const leftPriority = getPriority(lhs.blockchain);  // called again per comparison
  const rightPriority = getPriority(rhs.blockchain); // called again per comparison
})
```

For `n` items, a sort runs roughly `n log n` comparisons, calling `getPriority` twice each time. The priority for a given balance never changes during a sort pass.

**Fix:** Compute priority once per item with a `.map()` before the `.sort()`, then sort by the pre-computed field.

---

### 7. `prices` listed as a `useMemo` dependency but never used inside

**Location:** `original.tsx` useMemo for `sortedBalances`

```ts
}, [balances, prices]); // ❌ prices is not read anywhere in this useMemo
```

Every time `prices` updates (e.g. on a price tick), `sortedBalances` is recomputed even though the result is identical.

**Fix:** Remove `prices` from the dependency array.

---

### 8. `formattedBalances` is computed every render but never consumed

**Location:** `original.tsx`

```ts
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return { ...balance, formatted: balance.amount.toFixed() }
});
// formattedBalances is never referenced again — rows uses sortedBalances instead
```

This allocates a new array and new objects on every render for no effect.

**Fix:** Remove `formattedBalances` entirely and fold the `formatted` field into the `useMemo` pipeline.

---

### 9. `rows` is not memoized

**Location:** `original.tsx`

```ts
const rows = sortedBalances.map(...)
```

`rows` rebuilds the entire JSX array on every render, even when `sortedBalances` and `prices` have not changed.

**Fix:** Wrap in `useMemo([sortedBalances, prices])`.

---

## Anti-patterns

### 10. `getPriority` accepts `any`

```ts
const getPriority = (blockchain: any): number => {
```

`any` turns off all type checking on the argument. The missing `blockchain` field on `WalletBalance` goes unnoticed because of this.

**Fix:** Type the parameter as `string` (or a string literal union of known blockchains).

---

### 11. `getPriority` defined inside the component

```ts
const WalletPage: React.FC<Props> = (props) => {
  ...
  const getPriority = (blockchain: any): number => { ... }
```

The function is recreated as a new object on every render. It has no dependency on props, state, or context.

**Fix:** Move it (and the priority map) to module scope.

---

### 12. Array `index` used as React `key`

```tsx
key={index}
```

After sorting, indices are reassigned. React uses `key` to track element identity across renders — using index post-sort causes unnecessary unmounts/remounts and breaks any local state inside `WalletRow`.

**Fix:** Use `balance.currency` (or another stable, unique identifier) as the key.

---

### 13. `children` destructured but never rendered

```ts
const { children, ...rest } = props;
// children is never used in the JSX
```

Either `children` should be rendered, or it should not be destructured (and `Props` should not extend `BoxProps` with children support if it is intentionally ignored).

---

## Summary Table

| # | Severity | Category | Issue |
|---|----------|----------|-------|
| 1 | Critical | Bug | `lhsPriority` undefined — ReferenceError at runtime |
| 2 | High | Bug | Filter logic inverted — keeps zero/negative balances |
| 3 | High | Type Bug | `blockchain` missing from `WalletBalance` interface |
| 4 | High | Bug | `rows` accesses `balance.formatted` which is `undefined` |
| 5 | Medium | Bug | Sort comparator returns `undefined` for equal priorities |
| 6 | Medium | Performance | `getPriority` called O(n log n) times instead of O(n) |
| 7 | Medium | Performance | `prices` in `useMemo` deps causes unnecessary recomputes |
| 8 | Low | Performance | `formattedBalances` computed every render but never used |
| 9 | Low | Performance | `rows` not memoized |
| 10 | Low | Anti-pattern | `getPriority` param typed `any` |
| 11 | Low | Anti-pattern | `getPriority` recreated inside component on every render |
| 12 | Low | Anti-pattern | Array index used as React `key` after sort |
| 13 | Low | Unclear intent | `children` destructured but never rendered |
