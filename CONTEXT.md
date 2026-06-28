# Calculator

A single-page calculator app with immediate-execution arithmetic, keyboard support, and monochromatic dark/light theme. Built as a portable Docker image.

## Language

### State

**Current Value**:
The number displayed on screen and used as the right operand in a pending operation.
_Avoid_: Display, input, buffer

**Previous Value**:
The left operand stored when an operator is pressed, held until equals or a new operator commits it.
_Avoid_: Left operand, memory, accumulator

**Operation**:
The pending arithmetic operator (+, −, ×, ÷) shown in the display preview. Applied when equals is pressed or when a new operator chains the calculation.
_Avoid_: Operator, pending op

**Reset Next**:
A flag that signals the next digit input should replace the display contents rather than append. Set after an operator or equals. Cleared on the first digit after reset.
_Avoid_: Reset, clear on next input

**Error**:
A terminal display state entered on division by zero or numeric overflow. All button presses except CLEAR are ignored until AC dismisses it.

### Behavior

**Immediate Execution**:
Calculation model where each operator commits the previous operation and stores the new operator in one step. No waiting for equals to evaluate — chained operations (2 + 3 × 4) run left-to-right, not by precedence.

**Digit Cap**:
Maximum of 15 significant digits. Calculator ignores input beyond this limit to prevent display overflow.

**Chained Calculation**:
Pressing an operator when an operation is already pending computes the pending operation first, stores the result as the new previous value, then saves the new operator.
