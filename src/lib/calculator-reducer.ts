import type { CalculatorAction, CalculatorState } from "./calculator-types";
import { initialState } from "./calculator-types";

function calculate(a: string, op: string, b: string): string {
  const left = Number.parseFloat(a);
  const right = Number.parseFloat(b);
  let result: number;
  switch (op) {
    case "+": result = left + right; break;
    case "-": result = left - right; break;
    case "×":
    case "*": result = left * right; break;
    case "÷":
    case "/":
      if (right === 0) return "Error";
      result = left / right;
      break;
    default: result = right;
  }
  if (!Number.isFinite(result)) return "Error";
  const str = String(result);
  if (str === "0") return "0";
  // Cap at 15 significant digits (excluding sign and decimal)
  const significant = str.replace(".", "").replace("-", "");
  if (significant.length > 15) return "Error";
  // Avoid floating-point artifacts: trim to 15 chars max
  return str.length > 15 ? str.slice(0, 16) : str;
}

function isError(val: string): boolean {
  return val === "Error" || val === "Infinity" || val === "-Infinity" || val === "NaN";
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  if (state.error && action.type !== "CLEAR") return { ...state };

  switch (action.type) {
    case "CLEAR":
      return { ...initialState };

    case "DIGIT": {
      if (state.resetNext) {
        return { ...state, currentValue: action.payload, resetNext: false };
      }
      const cur = state.currentValue === "0" ? action.payload : state.currentValue + action.payload;
      if (cur.replace(".", "").replace("-", "").length > 15) return { ...state };
      return { ...state, currentValue: cur };
    }

    case "DECIMAL": {
      if (state.resetNext) {
        return { ...state, currentValue: "0.", resetNext: false };
      }
      if (state.currentValue.includes(".")) return { ...state };
      return { ...state, currentValue: state.currentValue + "." };
    }

    case "OPERATOR": {
      if (state.operation && state.previousValue !== null) {
        const result = calculate(state.previousValue, state.operation, state.currentValue);
        if (isError(result)) return { ...state, error: true, currentValue: "0" };
        return {
          currentValue: result,
          previousValue: result,
          operation: action.payload,
          resetNext: true,
          error: false,
        };
      }
      return {
        ...state,
        previousValue: state.currentValue,
        operation: action.payload,
        resetNext: true,
      };
    }

    case "EQUALS": {
      if (state.operation && state.previousValue !== null) {
        const result = calculate(state.previousValue, state.operation, state.currentValue);
        if (isError(result)) return { ...state, error: true, currentValue: "0" };
        return {
          currentValue: result,
          previousValue: null,
          operation: null,
          resetNext: true,
          error: false,
        };
      }
      return { ...state };
    }

    case "PERCENT": {
      const val = Number.parseFloat(state.currentValue) / 100;
      return { ...state, currentValue: String(val), resetNext: true };
    }

    case "NEGATE": {
      if (state.currentValue === "0") return { ...state };
      const neg = state.currentValue.startsWith("-")
        ? state.currentValue.slice(1)
        : "-" + state.currentValue;
      return { ...state, currentValue: neg };
    }

    case "BACKSPACE": {
      if (state.currentValue === "0" || state.currentValue === "-0") return { ...state };
      const next = state.currentValue.length === 1 ||
        (state.currentValue.length === 2 && state.currentValue.startsWith("-"))
        ? "0"
        : state.currentValue.slice(0, -1);
      return { ...state, currentValue: next };
    }

    default:
      return { ...state };
  }
}
