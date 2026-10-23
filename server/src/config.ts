import type { Scenario } from "../../shared/types";

// The two futures we show side by side.
// w = how much skill trends matter, p = how hard automation exposure hits.
export const SCENARIOS: Record<Scenario, { w: number; p: number; label: string }> = {
  moderate: { w: 0.3, p: 0.15, label: "Moderate AI disruption" },
  fast: { w: 0.6, p: 0.35, label: "Fast AI disruption" },
};

// Points a role gets when it serves an SDG the user cares about.
// Not included in score: the UI's SDG slider adds weight × sdgBoost on top.
export const SDG_POINTS = 5;

// Clamp skill momentum to [-1, 1] so one viral skill can't dominate a role.
export const MOMENTUM_CAP = 1;
