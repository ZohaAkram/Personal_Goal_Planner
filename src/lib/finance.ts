export type CalculatorInput = {
  goalName: string;
  goalAmount: number;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  annualRaiseRate: number;
  annualInflationRate: number;
  targetMonths: number;
};

export type MonthPoint = {
  month: number;
  savings: number;
  futureCost: number;
  monthlyContribution: number;
  monthlyIncome: number;
  monthlyExpenses: number;
};

export type CalculatorResult = {
  monthlySurplus: number;
  futureGoalCostAtTarget: number;
  monthsToGoal: number | null;
  goalDateLabel: string | null;
  projectedSavingsAtTarget: number;
  shortfallAtTarget: number;
  isOnTrack: boolean;
  neededMonthlyContributionForTarget: number;
  extraNeededPerMonth: number;
  suggestedExtraIncomePerMonth: number;
  suggestedExpenseCutPerMonth: number;
  projection: MonthPoint[];
};

const MAX_MONTHS = 600;

export type CurrencyOption = {
  code: string;
  label: string;
  locale: string;
  suggestedInflationRate: number;
};

export function currency(value: number, option: CurrencyOption): string {
  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    maximumFractionDigits: 0
  }).format(Math.max(0, value));
}

export function clampNumber(value: number, min = 0): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, value);
}

export function calculateGoal(input: CalculatorInput, startDate = new Date()): CalculatorResult {
  const goalAmount = clampNumber(input.goalAmount);
  const currentSavings = clampNumber(input.currentSavings);
  const monthlyIncome = clampNumber(input.monthlyIncome);
  const monthlyExpenses = clampNumber(input.monthlyExpenses);
  const annualRaiseRate = clampNumber(input.annualRaiseRate) / 100;
  const annualInflationRate = clampNumber(input.annualInflationRate) / 100;
  const targetMonths = Math.max(1, Math.round(clampNumber(input.targetMonths, 1)));

  const monthlyRaiseRate = Math.pow(1 + annualRaiseRate, 1 / 12) - 1;
  const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1 / 12) - 1;

  let savings = currentSavings;
  let income = monthlyIncome;
  let expenses = monthlyExpenses;
  let monthsToGoal: number | null = currentSavings >= goalAmount ? 0 : null;
  const projection: MonthPoint[] = [];

  for (let month = 1; month <= MAX_MONTHS; month += 1) {
    if (month > 1) {
      income *= 1 + monthlyRaiseRate;
      expenses *= 1 + monthlyInflationRate;
    }

    const futureCost = goalAmount * Math.pow(1 + monthlyInflationRate, month);
    const monthlyContribution = income - expenses;
    savings += monthlyContribution;

    if (month <= 120 || monthsToGoal === null) {
      projection.push({
        month,
        savings,
        futureCost,
        monthlyContribution,
        monthlyIncome: income,
        monthlyExpenses: expenses
      });
    }

    if (monthsToGoal === null && savings >= futureCost) {
      monthsToGoal = month;
    }
  }

  const targetPoint = projection[Math.min(targetMonths - 1, projection.length - 1)];
  const futureGoalCostAtTarget = goalAmount * Math.pow(1 + monthlyInflationRate, targetMonths);
  const projectedSavingsAtTarget = targetPoint?.savings ?? currentSavings;
  const shortfallAtTarget = Math.max(0, futureGoalCostAtTarget - projectedSavingsAtTarget);
  const neededMonthlyContributionForTarget = Math.max(
    0,
    (futureGoalCostAtTarget - currentSavings) / targetMonths
  );
  const averageProjectedContribution =
    projection.slice(0, targetMonths).reduce((total, point) => total + point.monthlyContribution, 0) /
    targetMonths;
  const extraNeededPerMonth = Math.max(0, neededMonthlyContributionForTarget - averageProjectedContribution);

  return {
    monthlySurplus: monthlyIncome - monthlyExpenses,
    futureGoalCostAtTarget,
    monthsToGoal,
    goalDateLabel: monthsToGoal === null ? null : formatGoalDate(addMonths(startDate, monthsToGoal)),
    projectedSavingsAtTarget,
    shortfallAtTarget,
    isOnTrack: projectedSavingsAtTarget >= futureGoalCostAtTarget,
    neededMonthlyContributionForTarget,
    extraNeededPerMonth,
    suggestedExtraIncomePerMonth: extraNeededPerMonth,
    suggestedExpenseCutPerMonth: extraNeededPerMonth,
    projection
  };
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function formatGoalDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}
