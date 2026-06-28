# Calculator

A clean, minimal calculator: basic operations, keyboard support, monochromatic dark/light theme. Single-page Next.js app, portable Docker image.

## Quick Start

```bash
# dev
npm install
npm run dev      # → http://localhost:3000

# test
npm test         # vitest — unit tests for the reducer

# build & run (Docker)
docker build -t calculator .
docker run -p 3000:3000 calculator
```

## Architecture

```
src/
├── lib/
│   ├── calculator-types.ts   — State & action types, initial state
│   ├── calculator-reducer.ts  — Pure reducer (the only business logic)
│   └── button-config.ts       — Key layout & action mapping
├── components/
│   ├── calculator.tsx          — Stateful container, keyboard listener
│   ├── display.tsx             — Current value + pending op preview
│   ├── keypad.tsx              — CSS grid layout
│   ├── calculator-button.tsx   — Single button with variant styling
│   ├── theme-provider.tsx      — next-themes wrapper
│   └── theme-toggle.tsx        — Dark/light toggle
├── app/
│   ├── page.tsx                — Single route (/)
│   ├── layout.tsx              — Root layout with ThemeProvider
│   └── globals.css             — CSS variables, Tailwind imports
└── __tests__/
    └── calculator-reducer.test.ts
```

## Decisions

- **Immediate execution** — each operator commits the previous op. Left-to-right, no precedence. See [ADR-0001](./docs/adr/0001-immediate-execution.md).
- **String-based state** — numbers stored as strings for exact digit-cap and display fidelity. See [ADR-0002](./docs/adr/0002-string-based-numbers.md).
- **useReducer** — single pure function, no external state lib.

## Domain Language

See [CONTEXT.md](./CONTEXT.md) for glossary of state terms (currentValue, previousValue, resetNext, error) and behavioural concepts.

## Deployment

```bash
docker build -t calculator .
docker run -p 3000:3000 calculator
```

Image is ~150 MB (Node 22 Alpine, Next.js standalone output). Port 3000.
