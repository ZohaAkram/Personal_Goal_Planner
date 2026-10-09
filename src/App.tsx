import { CalendarDays, CircleHelp, PiggyBank, Target, TrendingUp, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { calculateGoal, currency, type CalculatorInput } from "./lib/finance";

const goalOptions = [
  { label: "Car", goalName: "Car", amount: 25000 },
  { label: "House down payment", goalName: "House down payment", amount: 80000 },
  { label: "Emergency fund", goalName: "Emergency fund", amount: 15000 },
  { label: "Other", goalName: "", amount: 10000 }
];

const initialInput: CalculatorInput = {
  goalName: "New car",
  goalAmount: 25000,
  currentSavings: 4000,
  monthlyIncome: 4500,
  monthlyExpenses: 3300,
  annualRaiseRate: 3,
  annualInflationRate: 3,
  targetMonths: 36
};

function numberValue(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

export default function App() {
  const [form, setForm] = useState<CalculatorInput>(initialInput);
  const [goalType, setGoalType] = useState("Car");
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

  const finishSummary =
    result.monthsToGoal === null
      ? "Not reachable within 50 years with these inputs"
      : result.monthsToGoal === 0
        ? "You can afford this goal today"
        : `${result.monthsToGoal} months`;

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Personal goal planner</p>
          <h1>See when your money catches up to your goal.</h1>
          <p>
            Estimate a realistic timeline, account for inflation, and see the monthly change needed to
            reach big purchases sooner.
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
            <span>Estimated future price</span>
            <strong>{currency(result.futureGoalCostAtTarget)}</strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="panel inputs" aria-label="Financial goal inputs">
          <div className="panel-heading">
            <Target size={22} aria-hidden="true" />
            <div>
              <h2>Goal details</h2>
              <p>Start with a goal, then tune your monthly reality.</p>
            </div>
          </div>

          <label>
            Goal type
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
              Goal name
              <input
                placeholder="Example: Wedding, laptop, vacation"
                value={form.goalName}
                onChange={(event) => updateField("goalName", event.target.value)}
              />
            </label>
          )}

          <div className="field-grid">
            <label>
              Goal amount
              <input
                inputMode="numeric"
                value={form.goalAmount}
                onChange={(event) => updateField("goalAmount", event.target.value)}
              />
            </label>
            <label>
              Current savings
              <input
                inputMode="numeric"
                value={form.currentSavings}
                onChange={(event) => updateField("currentSavings", event.target.value)}
              />
            </label>
            <label>
              Monthly income
              <input
                inputMode="numeric"
                value={form.monthlyIncome}
                onChange={(event) => updateField("monthlyIncome", event.target.value)}
              />
            </label>
            <label>
              Monthly expenses
              <input
                inputMode="numeric"
                value={form.monthlyExpenses}
                onChange={(event) => updateField("monthlyExpenses", event.target.value)}
              />
            </label>
            <label>
              Annual raise %
              <input
                inputMode="decimal"
                value={form.annualRaiseRate}
                onChange={(event) => updateField("annualRaiseRate", event.target.value)}
              />
            </label>
            <label>
              Inflation %
              <input
                inputMode="decimal"
                value={form.annualInflationRate}
                onChange={(event) => updateField("annualInflationRate", event.target.value)}
              />
            </label>
          </div>

          <label className="target-slider">
            <span>
              Target timeline <strong>{form.targetMonths} months</strong>
            </span>
            <input
              type="range"
              min="6"
              max="120"
              step="1"
              value={form.targetMonths}
              onChange={(event) => updateField("targetMonths", event.target.value)}
            />
          </label>
        </form>

        <section className="results" aria-label="Goal calculation results">
          <div className={result.isOnTrack ? "status on-track" : "status needs-work"}>
            <div>
              <p className="eyebrow">Track check</p>
              <h2>{result.isOnTrack ? "You are on track for your target." : "You need a small plan change."}</h2>
            </div>
            <strong>{result.isOnTrack ? "On track" : `${currency(result.extraNeededPerMonth)} / mo short`}</strong>
          </div>

          <div className="metric-grid">
            <Metric
              icon={<CalendarDays size={22} />}
              label="Estimated finish date"
              value={result.goalDateLabel ?? "Not yet"}
              helper="The first month your projected savings can cover the future price. Formula: month where savings >= future price."
            />
            <Metric
              icon={<TrendingUp size={22} />}
              label="Future goal price"
              value={currency(result.futureGoalCostAtTarget)}
              helper="What your goal may cost by your selected timeline. Formula: goal amount adjusted by inflation each month."
            />
            <Metric
              icon={<WalletCards size={22} />}
              label="Money left each month"
              value={currency(result.monthlySurplus)}
              helper="The amount available before extra saving choices. Formula: monthly income - monthly expenses."
            />
            <Metric
              icon={<PiggyBank size={22} />}
              label="Savings by target date"
              value={currency(result.projectedSavingsAtTarget)}
              helper="Your projected savings at the timeline you selected. Formula: current savings + monthly leftover over time, including raises and inflation."
            />
          </div>

          <div className="panel advice">
            <h2>To reach it sooner</h2>
            {result.extraNeededPerMonth > 0 ? (
              <div className="advice-grid">
                <div>
                  <span>Save more <InfoTooltip text="Extra amount to put aside monthly. Formula: needed monthly savings - projected monthly savings." /></span>
                  <strong>{currency(result.extraNeededPerMonth)} / month</strong>
                  <p>Move this much more into savings each month to hit your selected timeline.</p>
                </div>
                <div>
                  <span>Earn more <InfoTooltip text="Extra monthly income that would close the same gap if expenses stay the same." /></span>
                  <strong>{currency(result.suggestedExtraIncomePerMonth)} / month</strong>
                  <p>A side income or raise of this amount creates the same improvement.</p>
                </div>
                <div>
                  <span>Spend less <InfoTooltip text="Monthly expense reduction that would close the same gap if income stays the same." /></span>
                  <strong>{currency(result.suggestedExpenseCutPerMonth)} / month</strong>
                  <p>Cutting recurring expenses by this amount also closes the gap.</p>
                </div>
              </div>
            ) : (
              <p className="success-note">
                Your current plan reaches the selected timeline. Keeping the surplus consistent is the main job.
              </p>
            )}
          </div>

        </section>
      </section>
    </main>
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
