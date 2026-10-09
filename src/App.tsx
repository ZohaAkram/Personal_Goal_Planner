import { CalendarDays, CircleHelp, PiggyBank, Target, TrendingUp, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateGoal, currency, type CalculatorInput } from "./lib/finance";

const goalOptions = [
  { label: "Car", goalName: "Car", amount: 2500000 },
  { label: "House down payment", goalName: "House down payment", amount: 3000000 },
  { label: "Emergency fund", goalName: "Emergency fund", amount: 500000 },
  { label: "Other", goalName: "", amount: 100000 }
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

function numberValue(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

export default function App() {
  const [form, setForm] = useState<CalculatorInput>(initialInput);
  const [goalType, setGoalType] = useState("Car");
  const [timelineChoice, setTimelineChoice] = useState(36);
  const result = useMemo(() => calculateGoal(form), [form]);

  function updateField(field: keyof CalculatorInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "goalName" ? value : numberValue(value)
    }));
  }

  function updateGoalType(value: string) {
    setGoalType(value);
    const selectedGoal = goalOptions.find((option) => option.label === value);
    if (!selectedGoal) return;

    setForm((current) => ({
      ...current,
      goalName: selectedGoal.goalName,
      goalAmount: selectedGoal.amount
    }));
  }

  function updateTimeline(value: string) {
    const months = numberValue(value);
    setTimelineChoice(months);
    if (months > 0) {
      updateField("targetMonths", String(months));
    }
  }

  const finishSummary =
    result.monthsToGoal === null
      ? "Not reachable within 50 years with these inputs"
      : result.monthsToGoal === 0
        ? "You can afford this goal today"
        : formatMonths(result.monthsToGoal);

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
        <div className="hero-stats" aria-label="Current result summary">
          <div>
            <span>Goal</span>
            <strong>{form.goalName || "Your goal"}</strong>
          </div>
          <div>
            <span>Estimated finish</span>
            <strong>{finishSummary}</strong>
          </div>
          <div>
            <span>Expected future price</span>
            <strong>{currency(result.futureGoalCostAtTarget)}</strong>
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
                value={form.goalName}
                onChange={(event) => updateField("goalName", event.target.value)}
              />
            </label>
          )}

          <div className="field-grid">
            <label>
              <FieldText label="Price today" help="How much this goal costs right now in Pakistani rupees." />
              <input
                inputMode="numeric"
                value={form.goalAmount}
                onChange={(event) => updateField("goalAmount", event.target.value)}
              />
            </label>
            <label>
              <FieldText label="Savings you have now" help="Money already saved for this goal." />
              <input
                inputMode="numeric"
                value={form.currentSavings}
                onChange={(event) => updateField("currentSavings", event.target.value)}
              />
            </label>
            <label>
              <FieldText label="Monthly income" help="Your monthly take-home income, pocket money, salary, business income, or household contribution." />
              <input
                inputMode="numeric"
                value={form.monthlyIncome}
                onChange={(event) => updateField("monthlyIncome", event.target.value)}
              />
            </label>
            <label>
              <FieldText label="Monthly spending" help="Your regular monthly costs, such as rent, food, transport, bills, fees, and personal spending." />
              <input
                inputMode="numeric"
                value={form.monthlyExpenses}
                onChange={(event) => updateField("monthlyExpenses", event.target.value)}
              />
            </label>
            <label>
              <FieldText label="Yearly income increase %" help="Expected yearly increase in income. Use 0 if you are not sure." />
              <input
                inputMode="decimal"
                value={form.annualRaiseRate}
                onChange={(event) => updateField("annualRaiseRate", event.target.value)}
              />
            </label>
            <label>
              <FieldText label="Yearly price increase %" help="Expected yearly increase in prices. Pakistan inflation can change, so this is only an estimate." />
              <input
                inputMode="decimal"
                value={form.annualInflationRate}
                onChange={(event) => updateField("annualInflationRate", event.target.value)}
              />
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
                value={form.targetMonths}
                onChange={(event) => updateField("targetMonths", event.target.value)}
              />
            </label>
          )}
        </form>

        <section className="results" aria-label="Goal calculation results">
          <div className={result.isOnTrack ? "status on-track" : "status needs-work"}>
            <div>
              <p className="eyebrow">Quick answer</p>
              <h2>{result.isOnTrack ? "Your current plan can work." : "You may need to save or earn more."}</h2>
            </div>
            <strong>{result.isOnTrack ? "Looks good" : `${currency(result.extraNeededPerMonth)} / month short`}</strong>
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
              value={currency(result.futureGoalCostAtTarget)}
              helper="What this goal may cost by your chosen time. Formula: price today + estimated price increase over time."
            />
            <Metric
              icon={<WalletCards size={22} />}
              label="Money left monthly"
              value={currency(result.monthlySurplus)}
              helper="Money left after regular spending. Formula: monthly income - monthly spending."
            />
            <Metric
              icon={<PiggyBank size={22} />}
              label="Savings by chosen time"
              value={currency(result.projectedSavingsAtTarget)}
              helper="How much you may have saved by your chosen time. Formula: savings now + monthly leftover over time."
            />
          </div>

          <div className="panel advice">
            <h2>What can help?</h2>
            {result.extraNeededPerMonth > 0 ? (
              <div className="advice-grid">
                <div>
                  <span>Save extra <InfoTooltip text="Extra money to keep aside every month to reach your chosen time." /></span>
                  <strong>{currency(result.extraNeededPerMonth)} / month</strong>
                  <p>Try to put this extra amount into savings each month.</p>
                </div>
                <div>
                  <span>Earn extra <InfoTooltip text="Extra monthly income needed if your spending stays the same." /></span>
                  <strong>{currency(result.suggestedExtraIncomePerMonth)} / month</strong>
                  <p>A small side income, tuition, freelance work, or raise could help.</p>
                </div>
                <div>
                  <span>Spend less <InfoTooltip text="Monthly spending cut needed if your income stays the same." /></span>
                  <strong>{currency(result.suggestedExpenseCutPerMonth)} / month</strong>
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
      </section>
    </main>
  );
}

function formatMonths(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} year${years === 1 ? "" : "s"}` : `${months} months`;
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
