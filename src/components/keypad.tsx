"use client";

import { buttonConfigs } from "@/lib/button-config";
import { CalculatorButton } from "./calculator-button";

export function Keypad({ onButton }: { onButton: (action: string, payload?: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4 pt-0">
      {buttonConfigs.map((cfg) => (
        <CalculatorButton
          key={cfg.label}
          config={cfg}
          onClick={() => {
            if (cfg.action === "DIGIT") onButton(cfg.action, cfg.label);
            else if (cfg.action === "OPERATOR") onButton(cfg.action, cfg.label);
            else onButton(cfg.action);
          }}
        />
      ))}
    </div>
  );
}
