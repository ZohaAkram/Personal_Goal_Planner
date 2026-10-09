import { CalendarDays, CircleHelp, PiggyBank, Target, TrendingUp, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateGoal, currency, type CalculatorInput, type CurrencyOption } from "./lib/finance";

const currencyOptions: CurrencyOption[] = [
  { code: "PKR", label: "Pakistani rupee (PKR)", locale: "en-PK", suggestedInflationRate: 10 },
  { code: "USD", label: "US dollar (USD)", locale: "en-US", suggestedInflationRate: 3 },
  { code: "GBP", label: "British pound (GBP)", locale: "en-GB", suggestedInflationRate: 3 },
  { code: "EUR", label: "Euro (EUR)", locale: "en-IE", suggestedInflationRate: 2.5 },
  { code: "AED", label: "UAE dirham (AED)", locale: "en-AE", suggestedInflationRate: 2 },
  { code: "SAR", label: "Saudi riyal (SAR)", locale: "en-SA", suggestedInflationRate: 2 },
  { code: "INR", label: "Indian rupee (INR)", locale: "en-IN", suggestedInflationRate: 5 },
  { code: "BDT", label: "Bangladeshi taka (BDT)", locale: "en-BD", suggestedInflationRate: 7 }
];

const goalOptions = [
  {
    label: "Car",
    goalName: "Car",
    amounts: { PKR: 2500000, USD: 25000, GBP: 20000, EUR: 23000, AED: 90000, SAR: 90000, INR: 900000, BDT: 1800000 }
  },
  {
    label: "House down payment",
    goalName: "House down payment",
    amounts: { PKR: 3000000, USD: 60000, GBP: 45000, EUR: 50000, AED: 220000, SAR: 220000, INR: 2500000, BDT: 4000000 }
  },
  {
    label: "Emergency fund",
    goalName: "Emergency fund",
    amounts: { PKR: 500000, USD: 5000, GBP: 4000, EUR: 4500, AED: 18000, SAR: 18000, INR: 200000, BDT: 350000 }
  },
  {
    label: "Other",
    goalName: "",
    amounts: { PKR: 100000, USD: 1000, GBP: 800, EUR: 900, AED: 3500, SAR: 3500, INR: 80000, BDT: 100000 }
  }
];

const timelineOptions = [
  { label: "6 months", value: 6 },
  { label: "1 year", value: 12 },
  { label: "1.5 years", value: 18 },
  { label: "2 years", value: 24 },
  { label: "3 years", value: 36 },
  { label: "5 years", value: 60 },
  { label: "Custom months", value: 0 }
];

const initialInput: CalculatorInput = {
  goalName: "Car",
  goalAmount: 2500000,
  currentSavings: 300000,
  monthlyIncome: 120000,
  monthlyExpenses: 85000,
  annualRaiseRate: 3,
  annualInflationRate: 10,
  targetMonths: 36
};

type NumericField = Exclude<keyof CalculatorInput, "goalName">;
type NumericInputState = Record<NumericField, string>;

const MAX_MONEY_INPUT = 1_000_000_000_000;
const MAX_RATE_INPUT = 100;
const MAX_TARGET_MONTHS = 600;

function numberValue(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

function initialNumericInputs(input: CalculatorInput): NumericInputState {
  return {
    goalAmount: String(input.goalAmount),
    currentSavings: String(input.currentSavings),
    monthlyIncome: String(input.monthlyIncome),
    monthlyExpenses: String(input.monthlyExpenses),
    annualRaiseRate: String(input.annualRaiseRate),
    annualInflationRate: String(input.annualInflationRate),
    targetMonths: String(input.targetMonths)
  };
}

function cleanNumberText(value: string): string {
  return value.replace(/,/g, "").trim();
}

function parseInputValue(value: string): number {
  const cleaned = cleanNumberText(value);
  return cleaned === "" ? 0 : Number(cleaned);
}

function validateNumber(
  value: string,
  options: { label: string; required?: boolean; min?: number; max?: number; allowZero?: boolean }
): string | null {
  const cleaned = cleanNumberText(value);
  if (cleaned === "") {
    return options.required ? `${options.label} is required.` : null;
  }

  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) {
    return `${options.label} must be a number.`;
  }

  if (parsed < (options.min ?? 0)) {
    return `${options.label} cannot be negative.`;
  }

  if (options.allowZero === false && parsed === 0) {
    return `${options.label} must be more than 0.`;
  }

  if (options.max !== undefined && parsed > options.max) {
    return `${options.label} is too large.`;
  }

  return null;
}

function getValidationErrors(values: NumericInputState): Partial<Record<NumericField, string>> {
  const errors: Partial<Record<NumericField, string>> = {};
  const rules: Record<NumericField, Parameters<typeof validateNumber>[1]> = {
    goalAmount: { label: "Price today", required: true, max: MAX_MONEY_INPUT, allowZero: false },
    currentSavings: { label: "Savings you have now", max: MAX_MONEY_INPUT },
    monthlyIncome: { label: "Monthly income", required: true, max: MAX_MONEY_INPUT },
    monthlyExpenses: { label: "Monthly spending", required: true, max: MAX_MONEY_INPUT },
    annualRaiseRate: { label: "Yearly income increase", max: MAX_RATE_INPUT },
    annualInflationRate: { label: "Inflation rate", max: MAX_RATE_INPUT },
    targetMonths: { label: "Custom months", required: true, max: MAX_TARGET_MONTHS, allowZero: false }
  };

  (Object.keys(rules) as NumericField[]).forEach((field) => {
    const message = validateNumber(values[field], rules[field]);
    if (message) errors[field] = message;
  });

  const monthlyIncome = parseInputValue(values.monthlyIncome);
  const monthlyExpenses = parseInputValue(values.monthlyExpenses);
  if (!errors.monthlyIncome && !errors.monthlyExpenses && monthlyExpenses > monthlyIncome) {
    errors.monthlyExpenses = "Monthly spending cannot be more than monthly income for this MVP.";
  }

  return errors;
}

function buildCalculatorInput(values: NumericInputState, goalName: string): CalculatorInput {
  return {
    goalName,
    goalAmount: parseInputValue(values.goalAmount),
    currentSavings: parseInputValue(values.currentSavings),
    monthlyIncome: parseInputValue(values.monthlyIncome),
    monthlyExpenses: parseInputValue(values.monthlyExpenses),
    annualRaiseRate: parseInputValue(values.annualRaiseRate),
    annualInflationRate: parseInputValue(values.annualInflationRate),
    targetMonths: parseInputValue(values.targetMonths)
  };
}

export default function App() {
  const [goalName, setGoalName] = useState(initialInput.goalName);
  const [numericInputs, setNumericInputs] = useState<NumericInputState>(() => initialNumericInputs(initialInput));
  const [goalType, setGoalType] = useState("Car");
  const [timelineChoice, setTimelineChoice] = useState(36);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);
  const validationErrors = useMemo(() => getValidationErrors(numericInputs), [numericInputs]);
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const form = useMemo(() => buildCalculatorInput(numericInputs, goalName), [numericInputs, goalName]);
  const result = useMemo(() => calculateGoal(form), [form]);
  const money = (value: number) => currency(value, selectedCurrency);
  const timelineLabel =
    timelineChoice === 0
      ? `${numericInputs.targetMonths || "Custom"} months`
      : timelineOptions.find((option) => option.value === timelineChoice)?.label ?? `${form.targetMonths} months`;

  function updateField(field: keyof CalculatorInput, value: string) {
    if (field === "goalName") {
      setGoalName(value);
      return;
    }

    setNumericInputs((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateGoalType(value: string) {
    setGoalType(value);
    const selectedGoal = goalOptions.find((option) => option.label === value);
    if (!selectedGoal) return;

    setGoalName(selectedGoal.goalName);
    setNumericInputs((current) => ({
      ...current,
      goalAmount: String(selectedGoal.amounts[selectedCurrency.code as keyof typeof selectedGoal.amounts])
    }));
  }

  function updateCurrency(code: string) {
    const nextCurrency = currencyOptions.find((option) => option.code === code);
    if (!nextCurrency) return;

    setSelectedCurrency(nextCurrency);
    setNumericInputs((current) => {
      const selectedGoal = goalOptions.find((option) => option.label === goalType);
      const nextGoalAmount =
        selectedGoal && goalType !== "Other"
          ? selectedGoal.amounts[nextCurrency.code as keyof typeof selectedGoal.amounts]
          : current.goalAmount;

      return {
        ...current,
        goalAmount: String(nextGoalAmount),
        annualInflationRate: String(nextCurrency.suggestedInflationRate)
      };
    });
  }

  function updateTimeline(value: string) {
    const months = numberValue(value);
    setTimelineChoice(months);
    if (months > 0) {
      updateField("targetMonths", String(months));
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Goal savings planner</p>
          <h1>Plan a big purchase without a confusing spreadsheet.</h1>
          <p>
            Enter your income, spending, and savings to see when you can afford things like a car,
            house payment, emergency fund, or anything else.
          </p>
        </div>
        <div className="hero-stats" aria-label="Current planning setup">
          <div>
            <span>Currency selected</span>
            <strong>{selectedCurrency.code}</strong>
          </div>
          <div>
            <span>Goal timeline</span>
            <strong>{timelineLabel}</strong>
          </div>
          <div>
            <span>Can save monthly</span>
            <strong>{hasValidationErrors ? "Fix inputs" : money(result.monthlySurplus)}</strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="panel inputs" aria-label="Financial goal inputs">
          <div className="panel-heading">
            <Target size={22} aria-hidden="true" />
            <div>
              <h2>Your goal and money</h2>
              <p>Use monthly numbers you roughly know. Exact figures are not required.</p>
            </div>
          </div>
          <p className="assumption-note">
            MVP assumption: monthly income should be greater than or equal to monthly spending.
          </p>

          <label>
            <FieldText
              label="Currency"
              help="Choose the currency you want to use. The app does not convert exchange rates. For preset goals, it uses sample prices for that currency."
            />
            <select
              value={selectedCurrency.code}
              onChange={(event) => updateCurrency(event.target.value)}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FieldText
              label="What are you saving for?"
              help="Choose a common goal or select Other to type your own, like wedding, laptop, fees, or Umrah."
            />
            <select value={goalType} onChange={(event) => updateGoalType(event.target.value)}>
              {goalOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {goalType === "Other" && (
            <label>
              <FieldText label="Goal name" help="Write the thing you want to save for." />
              <input
                placeholder="Example: wedding, laptop, school fees"
                value={goalName}
                onChange={(event) => updateField("goalName", event.target.value)}
              />
            </label>
          )}

          <div className="field-grid">
            <label>
              <FieldText label="Price today" help={`How much this goal costs right now in ${selectedCurrency.code}.`} />
              <input
                inputMode="numeric"
                value={numericInputs.goalAmount}
                onChange={(event) => updateField("goalAmount", event.target.value)}
                aria-invalid={Boolean(validationErrors.goalAmount)}
                aria-describedby={validationErrors.goalAmount ? "goalAmount-error" : undefined}
              />
              <FieldError id="goalAmount-error" message={validationErrors.goalAmount} />
            </label>
            <label>
              <FieldText label="Savings you have now" help="Money already saved for this goal." />
              <input
                inputMode="numeric"
                value={numericInputs.currentSavings}
                onChange={(event) => updateField("currentSavings", event.target.value)}
                aria-invalid={Boolean(validationErrors.currentSavings)}
                aria-describedby={validationErrors.currentSavings ? "currentSavings-error" : undefined}
              />
              <FieldError id="currentSavings-error" message={validationErrors.currentSavings} />
            </label>
            <label>
              <FieldText label="Monthly income" help="Your monthly take-home income, pocket money, salary, business income, or household contribution." />
              <input
                inputMode="numeric"
                value={numericInputs.monthlyIncome}
                onChange={(event) => updateField("monthlyIncome", event.target.value)}
                aria-invalid={Boolean(validationErrors.monthlyIncome)}
                aria-describedby={validationErrors.monthlyIncome ? "monthlyIncome-error" : undefined}
              />
              <FieldError id="monthlyIncome-error" message={validationErrors.monthlyIncome} />
            </label>
            <label>
              <FieldText label="Monthly spending" help="Your regular monthly costs, such as rent, food, transport, bills, fees, and personal spending. For this MVP, monthly spending must be less than or equal to monthly income." />
              <input
                inputMode="numeric"
                value={numericInputs.monthlyExpenses}
                onChange={(event) => updateField("monthlyExpenses", event.target.value)}
                aria-invalid={Boolean(validationErrors.monthlyExpenses)}
                aria-describedby={validationErrors.monthlyExpenses ? "monthlyExpenses-error" : undefined}
              />
              <FieldError id="monthlyExpenses-error" message={validationErrors.monthlyExpenses} />
            </label>
            <label>
              <FieldText label="Yearly income increase %" help="Expected yearly increase in income. Use 0 if you are not sure." />
              <input
                inputMode="decimal"
                value={numericInputs.annualRaiseRate}
                onChange={(event) => updateField("annualRaiseRate", event.target.value)}
                aria-invalid={Boolean(validationErrors.annualRaiseRate)}
                aria-describedby={validationErrors.annualRaiseRate ? "annualRaiseRate-error" : undefined}
              />
              <FieldError id="annualRaiseRate-error" message={validationErrors.annualRaiseRate} />
            </label>
            <label>
              <FieldText
                label="Inflation rate %"
                help={`Estimated inflation per year. Suggested for ${selectedCurrency.code}: ${selectedCurrency.suggestedInflationRate}%. You can edit it.`}
              />
              <input
                inputMode="decimal"
                value={numericInputs.annualInflationRate}
                onChange={(event) => updateField("annualInflationRate", event.target.value)}
                aria-invalid={Boolean(validationErrors.annualInflationRate)}
                aria-describedby={validationErrors.annualInflationRate ? "annualInflationRate-error" : undefined}
              />
              <FieldError id="annualInflationRate-error" message={validationErrors.annualInflationRate} />
            </label>
          </div>

          <label>
            <FieldText
              label="When do you want it?"
              help="Pick the time you hope to reach the goal. This is used to check if you are on track."
            />
            <select value={timelineChoice} onChange={(event) => updateTimeline(event.target.value)}>
              {timelineOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {timelineChoice === 0 && (
            <label>
              <FieldText label="Custom months" help="Enter the number of months you want to save for." />
              <input
                inputMode="numeric"
                value={numericInputs.targetMonths}
                onChange={(event) => updateField("targetMonths", event.target.value)}
                aria-invalid={Boolean(validationErrors.targetMonths)}
                aria-describedby={validationErrors.targetMonths ? "targetMonths-error" : undefined}
              />
              <FieldError id="targetMonths-error" message={validationErrors.targetMonths} />
            </label>
          )}
        </form>

        {hasValidationErrors ? (
          <section className="panel validation-summary" aria-live="polite">
            <p className="eyebrow">Check inputs</p>
            <h2>Some numbers need fixing.</h2>
            <p>Please correct the highlighted fields before using the estimate.</p>
            <ul>
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </section>
        ) : (
        <section className="results" aria-label="Goal calculation results">
          <div className={result.isOnTrack ? "status on-track" : "status needs-work"}>
            <div>
              <p className="eyebrow">Quick answer</p>
              <h2>{result.isOnTrack ? "Your current plan can work." : "You may need to save or earn more."}</h2>
            </div>
            <strong>{result.isOnTrack ? "Looks good" : `${money(result.extraNeededPerMonth)} / month short`}</strong>
          </div>

          <div className="metric-grid">
            <Metric
              icon={<CalendarDays size={22} />}
              label="When you can buy it"
              value={result.goalDateLabel ?? "Not yet"}
              helper="The first month your savings can cover the expected future price. Formula: savings >= future price."
            />
            <Metric
              icon={<TrendingUp size={22} />}
              label="Expected future price"
              value={money(result.futureGoalCostAtTarget)}
              helper="What this goal may cost by your chosen time. Formula: price today + estimated price increase over time."
            />
            <Metric
              icon={<WalletCards size={22} />}
              label="Money left monthly"
              value={money(result.monthlySurplus)}
              helper="Money left after regular spending. Formula: monthly income - monthly spending."
            />
            <Metric
              icon={<PiggyBank size={22} />}
              label="Savings by chosen time"
              value={money(result.projectedSavingsAtTarget)}
              helper="How much you may have saved by your chosen time. Formula: savings now + monthly leftover over time."
            />
          </div>

          <div className="panel advice">
            <h2>What can help?</h2>
            {result.extraNeededPerMonth > 0 ? (
              <div className="advice-grid">
                <div>
                  <span>Save extra <InfoTooltip text="Extra money to keep aside every month to reach your chosen time." /></span>
                  <strong>{money(result.extraNeededPerMonth)} / month</strong>
                  <p>Try to put this extra amount into savings each month.</p>
                </div>
                <div>
                  <span>Earn extra <InfoTooltip text="Extra monthly income needed if your spending stays the same." /></span>
                  <strong>{money(result.suggestedExtraIncomePerMonth)} / month</strong>
                  <p>A small side income, tuition, freelance work, or raise could help.</p>
                </div>
                <div>
                  <span>Spend less <InfoTooltip text="Monthly spending cut needed if your income stays the same." /></span>
                  <strong>{money(result.suggestedExpenseCutPerMonth)} / month</strong>
                  <p>Reducing regular expenses by this amount can close the gap.</p>
                </div>
              </div>
            ) : (
              <p className="success-note">
                Your current plan reaches your chosen time. Try to keep saving consistently.
              </p>
            )}
          </div>

        </section>
        )}
      </section>
    </main>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <span className="field-error" id={id} role="alert">
      {message}
    </span>
  );
}

function FieldText({ label, help }: { label: string; help: string }) {
  return (
    <span className="field-label">
      {label}
      <InfoTooltip text={help} />
    </span>
  );
}

function Metric({ icon, label, value, helper }: { icon: React.ReactNode; label: string; value: string; helper: string }) {
  return (
    <article className="metric">
      <div className="metric-icon" aria-hidden="true">{icon}</div>
      <span className="metric-label">
        {label}
        <InfoTooltip text={helper} />
      </span>
      <strong>{value}</strong>
    </article>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="info-wrap">
      <button className="info-button" type="button" aria-label={text}>
        <CircleHelp size={15} aria-hidden="true" />
      </button>
      <span className="tooltip" role="tooltip">{text}</span>
    </span>
  );
}
