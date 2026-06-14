var formatN = function (n) {
  const num = Number(n)
  if (!Number.isFinite(num)) throw new TypeError(`Invalid input: ${n}`)
  const int = Math.trunc(num)
  if (int < 0) throw new RangeError(`n must be non-negative, got ${int}`)
  return int
}

// Gaussian formula: O(1) time, O(1) space
var sum_to_n_a = function (n) {
  n = formatN(n)
  return (n * (n + 1)) / 2
}

// Iterative loop: O(n) time, O(1) space
var sum_to_n_b = function (n) {
  n = formatN(n)
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }
  return sum
}

// Recursive: O(n) time, O(n) space (call stack)
var sum_to_n_c = function (n) {
  n = formatN(n)
  if (n <= 1) return n
  return n + sum_to_n_c(n - 1)
}
