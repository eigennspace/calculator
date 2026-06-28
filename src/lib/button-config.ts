"use client";

const keyConfig: Record<string, { label: string; action: string; span?: number; variant?: string }> = {
  AC: { label: "AC", action: "CLEAR", variant: "control" },
  "±": { label: "±", action: "NEGATE", variant: "control" },
  "%": { label: "%", action: "PERCENT", variant: "control" },
  "÷": { label: "÷", action: "OPERATOR", variant: "operator" },
  "7": { label: "7", action: "DIGIT", variant: "digit" },
  "8": { label: "8", action: "DIGIT", variant: "digit" },
  "9": { label: "9", action: "DIGIT", variant: "digit" },
  "×": { label: "×", action: "OPERATOR", variant: "operator" },
  "4": { label: "4", action: "DIGIT", variant: "digit" },
  "5": { label: "5", action: "DIGIT", variant: "digit" },
  "6": { label: "6", action: "DIGIT", variant: "digit" },
  "-": { label: "-", action: "OPERATOR", variant: "operator" },
  "1": { label: "1", action: "DIGIT", variant: "digit" },
  "2": { label: "2", action: "DIGIT", variant: "digit" },
  "3": { label: "3", action: "DIGIT", variant: "digit" },
  "+": { label: "+", action: "OPERATOR", variant: "operator" },
  "0": { label: "0", action: "DIGIT", variant: "digit", span: 2 },
  ".": { label: ".", action: "DECIMAL", variant: "digit" },
  "=": { label: "=", action: "EQUALS", variant: "equals" },
};

const order = [
  "AC", "±", "%", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=",
];

export const buttonConfigs = order.map((key) => keyConfig[key]);

export type ButtonConfig = (typeof buttonConfigs)[number];
