import type { RuleItem } from "../types/dispatch";

export const mockRules: RuleItem[] = [
  { id: "r1", category: "Drive times", setting: "Terminal to C gates", value: "8 min" },
  { id: "r2", category: "Drive times", setting: "Terminal to F gates", value: "13 min" },
  { id: "r3", category: "Shift lengths", setting: "Standard driver shift", value: "8 hr" },
  { id: "r4", category: "Lunch windows", setting: "Meal required by", value: "5th hour" },
  { id: "r5", category: "Pretrip times", setting: "Truck pretrip", value: "20 min" },
  { id: "r6", category: "Food safety windows", setting: "Cold cart max staging", value: "45 min" },
];
