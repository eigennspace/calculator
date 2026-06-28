# Test Only the Reducer (Not the UI)

Tests target only `calculatorReducer()` — the single pure function that drives all calculator behavior. No UI tests, no integration tests, no snapshot tests, no E2E tests.

**Why:** The reducer is the only business logic in the app. All state transitions are deterministic: given state + action → expected new state. Everything else (display rendering, keyboard mapping, CSS grid layout) is framework boilerplate that either works or doesn't at compile time. Testing the reducer gives 100% functional coverage per the PRD user stories with zero flakiness and sub-second CI.

**Trade-off accepted:** A regressed keyboard handler or a broken display binding would not be caught by tests. These are caught by a manual smoke test before Docker image tagging (operators type, display shows numbers, equals computes). If UI regressions become a recurring issue, the next step is a single Playwright smoke test, not blanket component tests.

**Status**: Accepted  
**Options considered**: Component tests (React Testing Library), Playwright E2E, snapshot testing  
**Consequences**: CI runs in <2s for the test suite. No false positives from rendering changes. Manual smoke check required before release.
