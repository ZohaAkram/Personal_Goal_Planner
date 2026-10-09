import { describe, expect, it } from "vitest";
import { calculateGoal } from "./finance";

describe("calculateGoal", () => {
  it("marks a user on track when projected savings exceed inflated target cost", () => {
    const result = calculateGoal(
      {
        goalName: "Car",
        goalAmount: 12000,
        currentSavings: 3000,
        monthlyIncome: 5000,
        monthlyExpenses: 3500,
        annualRaiseRate: 3,
        annualInflationRate: 2,
        targetMonths: 8
      },
      new Date("2026-01-01")
    );

    expect(result.isOnTrack).toBe(true);
    expect(result.shortfallAtTarget).toBe(0);
    expect(result.monthsToGoal).toBeLessThanOrEqual(8);
  });

  it("calculates the extra monthly amount needed for a faster target", () => {
    const result = calculateGoal({
      goalName: "House",
      goalAmount: 50000,
      currentSavings: 5000,
      monthlyIncome: 4000,
      monthlyExpenses: 3500,
      annualRaiseRate: 0,
      annualInflationRate: 0,
      targetMonths: 24
    });

    expect(result.isOnTrack).toBe(false);
    expect(result.extraNeededPerMonth).toBeCloseTo(1375, 0);
    expect(result.suggestedExtraIncomePerMonth).toBe(result.extraNeededPerMonth);
    expect(result.suggestedExpenseCutPerMonth).toBe(result.extraNeededPerMonth);
  });
});
