export type CalculatorAction =
  | { type: "DIGIT"; payload: string }
  | { type: "DECIMAL" }
  | { type: "OPERATOR"; payload: string }
  | { type: "EQUALS" }
  | { type: "CLEAR" }
  | { type: "PERCENT" }
  | { type: "NEGATE" }
  | { type: "BACKSPACE" };

export type CalculatorState = {
  currentValue: string;
  previousValue: string | null;
  operation: string | null;
  resetNext: boolean;
  error: boolean;
};

export const initialState: CalculatorState = {
  currentValue: "0",
  previousValue: null,
  operation: null,
  resetNext: false,
  error: false,
};
