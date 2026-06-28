## Problem Statement

Users need a simple, fast, and beautiful calculator for everyday arithmetic. Existing solutions are either bloated with features or visually dated. A clean, minimal calculator with basic operations, keyboard support, and a modern monochromatic design is needed — packaged as a Docker image for easy deployment anywhere.

## Solution

A single-page Next.js calculator app with a monochromatic shadcn-ui interface, immediate-execution logic, light/dark theme support, full keyboard input, and error handling with a visual flair (💀). Runs as a portable Docker container via multi-stage build.

## User Stories

1. As a user, I want to add two numbers, so that I can perform basic sums
2. As a user, I want to subtract one number from another, so that I can compute differences
3. As a user, I want to multiply two numbers, so that I can calculate products
4. As a user, I want to divide one number by another, so that I can compute quotients
5. As a user, I want to calculate a percentage of a value, so that I can do quick percent math
6. As a user, I want to negate the current value, so that I can work with negative numbers
7. As a user, I want to type digits 0-9 on the keypad, so that I can enter numbers
8. As a user, I want to input a decimal point per number, so that I can work with fractional values
9. As a user, I want to clear the entire calculator state with one tap, so that I can start a fresh calculation
10. As a user, I want to see the current input in a large, readable display, so that I can easily verify what I've typed
11. As a user, I want to see what operation is pending before I press equals, so that I can track multi-step calculations
12. As a user, I want to press the `=` button to get my result, so that I can complete a calculation
13. As a user, I want to use my keyboard to type numbers and operators, so that I can calculate faster without clicking
14. As a user, I want to press Backspace to delete the last digit, so that I can correct mistakes without clearing everything
15. As a user, I want to press Escape or Delete to clear, so that keyboard-only workflow is complete
16. As a user, I want to see `💀 Error` when I divide by zero, so that I know the operation is invalid
17. As a user, I want to see `💀 Error` when the result overflows, so that I know the number is too large
18. As a user, I want to tap AC to dismiss an error, so that I can recover and continue
19. As a user, I want a maximum of 15 digits in my input, so that the display never overflows visually
20. As a user, I want a dark mode interface by default, so that it's comfortable to use in low-light environments
21. As a user, I want to toggle to light mode, so that I can use it comfortably in bright environments
22. As a user, I want rounded buttons in a clean grid layout, so that the UI feels modern and polished
23. As a user, I want the `0` key to be wider than other digit keys, so that it follows standard calculator ergonomics
24. As a user, I want to run the app as a Docker container, so that I can deploy it on any infrastructure without environment setup

## Implementation Decisions

### Calculation Model
- Immediate execution (not expression parsing). Each operator commits the previous operation and stores the new operator. No tokenizer or parser needed.
- No operator precedence — operations execute in the order they're entered (like a basic desk calculator, not a scientific one).

### State Machine (useReducer)
- Single reducer handles all calculator actions. Purely functional — given the same state and action, always produces the same state. This is the primary seam for testing.
- State shape and action types (from prototype):

```typescript
type CalculatorState = {
  currentValue: string;     // what's on screen, stored as string for digit append/truncation
  previousValue: string | null;  // left operand
  operation: string | null;      // pending operator
  resetNext: boolean;            // next digit clears display (after op or equals)
  error: boolean;                // 💀 Error state
}

// Actions: DIGIT | DECIMAL | OPERATOR | EQUALS | CLEAR | PERCENT | NEGATE | BACKSPACE
```

### Component Architecture
- **Display component** — renders current value in large monospace type with a smaller preview line for pending operation. Pure presentational.
- **Keypad component** — CSS grid layout rendering CalculatorButton instances. Pure presentational.
- **CalculatorButton component** — single `<button>` with variant styling (digit, operator, control, equals). Pure presentational.
- **Calculator container** — owns the `useReducer` state, passes dispatch to Keypad and state values to Display. Attaches global `keydown` listener for keyboard support. The only stateful component.
- **ThemeToggle** — thin wrapper around `next-themes`' `useTheme`.

### Visual Design
- Monochromatic neutral palette derived from shadcn-ui's slate/gray scale.
- `rounded-2xl` on all buttons, `aspect-square` for uniform fluid sizing (except `0` key at 2-column span).
- Dark mode default via `next-themes`, toggle preserved in localStorage.
- Font stack: monospace for display numbers, system sans for everything else.

### Error Handling
- Division by zero or overflow (result > 15 digits): state transitions to `{ error: true }`. Display shows `💀 Error`. All buttons except AC become no-ops.
- Overflow check is: result length > 15 digits OR result is `Infinity`.

### Keyboard Support
- A single `useEffect` attaches a `keydown` event listener to `document`.
- Each key maps to its equivalent reducer action. `*` maps to multiply, `/` to divide, etc.

### Container
- Multi-stage Docker build:
  - **Builder**: `node:22-alpine` — `npm ci`, `next build`
  - **Runner**: `node:22-alpine` — copies `standalone/` output, `public/`, `.next/static/`
  - Exposes port 3000, runs `node server.js` (Next.js standalone output)
- `.dockerignore` excludes `node_modules`, `.git`, `dist`, local env files

### Non-Domain Implementation Choices
- `next-themes` for theme toggling with localStorage persistence
- shadcn-ui button component as base (styling override for monochromatic look)
- No external state library — `useReducer` is sufficient
- No routing — single page at `/`

## Testing Decisions

- **What makes a good test:** Only test external behavior (given calculator state + action → expected new state). Not which internal function was called or how the UI re-renders.
- **What will be tested:** The `calculatorReducer` function. It is the only piece of business logic in the app. Pure function → trivial to unit test.
- **Testing approach:** Unit tests for the reducer: one test file covering every action type across representative state scenarios (start, mid-calculation, error state, decimal handling, chained operations). Boundary cases: divide by zero, max digits, overflow, trailing decimal, leading zeros.
- **Seams:** The reducer is the highest (and only) seam in the domain logic. No UI testing needed for functional correctness.

## Out of Scope

- Expression chaining / parentheses / operator precedence
- Memory functions (MC/MR/M+/M−)
- Scientific operations (trig, logs, exponents, roots beyond √)
- Calculation history log
- PWA / offline / service worker support
- Backend API or persistence layer
- Multi-language / i18n support
- Account system or multi-user features
- Unit test runner configuration (will use existing project defaults)

## Further Notes

- The entire app is client-side rendered. No server data fetching, no API routes, no database.
- Docker image is the primary deployment artifact. Build & run with: `docker build -t calculator . && docker run -p 3000:3000 calculator`.
- Design deliberately avoids color accents — pure monochrome for maximum minimalism. Only non-neutral elements are the 💀 emoji on errors and the theme toggle icon.
