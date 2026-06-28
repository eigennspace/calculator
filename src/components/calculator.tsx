"use client";

import { useReducer, useEffect } from "react";
import { calculatorReducer } from "@/lib/calculator-reducer";
import { initialState } from "@/lib/calculator-types";
import { Display } from "./display";
import { Keypad } from "./keypad";
import { ThemeToggle } from "./theme-toggle";

export function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") { dispatch({ type: "DIGIT", payload: e.key }); return; }
      if (e.key === ".") { dispatch({ type: "DECIMAL" }); return; }
      if (e.key === "+") { dispatch({ type: "OPERATOR", payload: "+" }); return; }
      if (e.key === "-") { dispatch({ type: "OPERATOR", payload: "-" }); return; }
      if (e.key === "*") { dispatch({ type: "OPERATOR", payload: "×" }); return; }
      if (e.key === "/") { e.preventDefault(); dispatch({ type: "OPERATOR", payload: "÷" }); return; }
      if (e.key === "Enter" || e.key === "=") { dispatch({ type: "EQUALS" }); return; }
      if (e.key === "Backspace") { dispatch({ type: "BACKSPACE" }); return; }
      if (e.key === "Escape" || e.key === "Delete") { dispatch({ type: "CLEAR" }); return; }
      if (e.key === "%") { dispatch({ type: "PERCENT" }); return; }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function onButton(action: string, payload?: string) {
    switch (action) {
      case "CLEAR": dispatch({ type: "CLEAR" }); break;
      case "DIGIT": dispatch({ type: "DIGIT", payload: payload! }); break;
      case "DECIMAL": dispatch({ type: "DECIMAL" }); break;
      case "OPERATOR": dispatch({ type: "OPERATOR", payload: payload! }); break;
      case "EQUALS": dispatch({ type: "EQUALS" }); break;
      case "PERCENT": dispatch({ type: "PERCENT" }); break;
      case "NEGATE": dispatch({ type: "NEGATE" }); break;
      case "BACKSPACE": dispatch({ type: "BACKSPACE" }); break;
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4">
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>
      <div className="rounded-3xl bg-card shadow-xl border border-border overflow-hidden">
        <Display
          value={state.currentValue}
          previousValue={state.previousValue}
          operation={state.operation}
          error={state.error}
        />
        <Keypad onButton={onButton} />
      </div>
    </div>
  );
}
