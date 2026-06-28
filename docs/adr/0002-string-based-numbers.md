# String-Based Number State

Calculator state holds numbers as strings (`currentValue: string`), not as JavaScript `number` or a decimal library like `decimal.js`.

Three reasons:
1. **Digit cap is exact.** The 15-significant-digit limit is checked by stripping `.` and `-` and measuring string length. With `number`, `0.1 + 0.2 = 0.30000000000000004` would exceed the cap spuriously.
2. **Display is direct.** The string on screen is the string in state — no `Number.toString()` radix or precision surprises, no trailing-zero stripping when `4.` becomes `"4"`.
3. **No dependency.** A decimal library would fix floating-point but adds weight for a 2-operand calculator that never does more than one operation at a time. Floating-point drift on a single `+` or `×` is well within display precision for common cases.

`calculate()` converts to `Number` only during the arithmetic step, then converts back. This is the only seam where floating-point enters — acceptable because the result is immediately capped and stored as a string.

**Status**: Accepted
**Options considered**: JavaScript `number`, `decimal.js`
**Consequences**: Overflow and division-by-zero are detected via `isError()` checking both `"Error"` and Infinity/NaN strings. The reducer never stores a non-string in `currentValue`.
