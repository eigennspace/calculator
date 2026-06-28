import { describe, it, expect } from "vitest";
import { calculatorReducer } from "@/lib/calculator-reducer";
import { initialState } from "@/lib/calculator-types";
import type { CalculatorState } from "@/lib/calculator-types";

function s(overrides: Partial<CalculatorState> = {}): CalculatorState {
  return { ...initialState, ...overrides };
}

describe("calculatorReducer", () => {
  it("CLEAR returns initial state", () => {
    const result = calculatorReducer(s({ currentValue: "42" }), { type: "CLEAR" });
    expect(result).toEqual(initialState);
  });

  it("DIGIT appends digit to currentValue", () => {
    const result = calculatorReducer(s({ currentValue: "5" }), { type: "DIGIT", payload: "3" });
    expect(result.currentValue).toBe("53");
  });

  it("DIGIT replaces 0 with digit", () => {
    const result = calculatorReducer(s({ currentValue: "0" }), { type: "DIGIT", payload: "7" });
    expect(result.currentValue).toBe("7");
  });

  it("DECIMAL adds decimal point", () => {
    const result = calculatorReducer(s({ currentValue: "5" }), { type: "DECIMAL" });
    expect(result.currentValue).toBe("5.");
  });

  it("DECIMAL does nothing if already has decimal", () => {
    const result = calculatorReducer(s({ currentValue: "5.3" }), { type: "DECIMAL" });
    expect(result.currentValue).toBe("5.3");
  });

  it("OPERATOR stores operation and resets for next input", () => {
    const result = calculatorReducer(s({ currentValue: "10" }), { type: "OPERATOR", payload: "+" });
    expect(result.operation).toBe("+");
    expect(result.previousValue).toBe("10");
    expect(result.resetNext).toBe(true);
  });

  it("OPERATOR chains calculation when previous op exists", () => {
    const s1 = calculatorReducer(s({ currentValue: "10" }), { type: "OPERATOR", payload: "+" });
    const s2 = calculatorReducer(s1, { type: "DIGIT", payload: "5" });
    const result = calculatorReducer(s2, { type: "OPERATOR", payload: "-" });
    expect(result.operation).toBe("-");
    expect(result.previousValue).toBe("15");
    expect(result.resetNext).toBe(true);
  });

  it("EQUALS computes result", () => {
    const s1 = calculatorReducer(s({ currentValue: "10" }), { type: "OPERATOR", payload: "+" });
    const s2 = calculatorReducer(s1, { type: "DIGIT", payload: "5" });
    const result = calculatorReducer(s2, { type: "EQUALS" });
    expect(result.currentValue).toBe("15");
    expect(result.operation).toBeNull();
    expect(result.resetNext).toBe(true);
  });

  it("PERCENT divides current by 100", () => {
    const result = calculatorReducer(s({ currentValue: "50" }), { type: "PERCENT" });
    expect(result.currentValue).toBe("0.5");
  });

  it("NEGATE toggles sign", () => {
    const r1 = calculatorReducer(s({ currentValue: "42" }), { type: "NEGATE" });
    expect(r1.currentValue).toBe("-42");
    const r2 = calculatorReducer(r1, { type: "NEGATE" });
    expect(r2.currentValue).toBe("42");
  });

  it("BACKSPACE removes last digit", () => {
    const r1 = calculatorReducer(s({ currentValue: "123" }), { type: "BACKSPACE" });
    expect(r1.currentValue).toBe("12");
    const r2 = calculatorReducer(r1, { type: "BACKSPACE" });
    expect(r2.currentValue).toBe("1");
    const r3 = calculatorReducer(r2, { type: "BACKSPACE" });
    expect(r3.currentValue).toBe("0");
    const r4 = calculatorReducer(r3, { type: "BACKSPACE" });
    expect(r4.currentValue).toBe("0");
  });

  it("division by zero sets error", () => {
    const s1 = calculatorReducer(s({ currentValue: "5" }), { type: "OPERATOR", payload: "÷" });
    const result = calculatorReducer(s1, { type: "DIGIT", payload: "0" });
    const error = calculatorReducer(result, { type: "EQUALS" });
    expect(error.error).toBe(true);
  });

  it("only CLEAR works in error state", () => {
    const result = calculatorReducer(
      s({ currentValue: "5", operation: "÷", previousValue: "5", resetNext: true, error: true }),
      { type: "DIGIT", payload: "3" }
    );
    expect(result.currentValue).toBe("5");
    expect(result.error).toBe(true);
  });

  it("DIGIT caps at 15 digits", () => {
    let cur = s({ currentValue: "0" });
    for (let i = 0; i < 16; i++) {
      cur = calculatorReducer(cur, { type: "DIGIT", payload: "1" });
    }
    expect(cur.currentValue.length).toBeLessThanOrEqual(16);
    expect(cur.currentValue.replace(".", "").length).toBeLessThanOrEqual(15);
  });

  it("EQUALS without operation returns state unchanged", () => {
    const result = calculatorReducer(s({ currentValue: "42" }), { type: "EQUALS" });
    expect(result.currentValue).toBe("42");
  });

  it("overflow of huge result sets error", () => {
    const s1 = calculatorReducer(s({ currentValue: "999999999999999" }), { type: "OPERATOR", payload: "×" });
    const result = calculatorReducer(s1, { type: "DIGIT", payload: "999" });
    const error = calculatorReducer(result, { type: "EQUALS" });
    expect(error.error).toBe(true);
  });

  it("NEGATE of 0 does nothing", () => {
    const result = calculatorReducer(s({ currentValue: "0" }), { type: "NEGATE" });
    expect(result.currentValue).toBe("0");
  });

  it("DECIMAL after operator resets to 0.", () => {
    const s1 = calculatorReducer(s({ currentValue: "10" }), { type: "OPERATOR", payload: "+" });
    const result = calculatorReducer(s1, { type: "DECIMAL" });
    expect(result.currentValue).toBe("0.");
    expect(result.resetNext).toBe(false);
  });
});
