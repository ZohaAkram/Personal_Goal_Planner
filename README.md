# Personal Financial Goal Calculator

An MVP web app for Pakistani users that helps everyday people estimate how long it may take to reach a financial goal such as buying a car, saving for a house down payment, building an emergency fund, paying fees, or planning a family expense.

Users enter a goal type, goal amount in Pakistani rupees, current savings, monthly income, monthly spending, expected yearly income increase, expected yearly price increase, and a simple target timeline. The calculator estimates:

- when the goal may be reachable,
- what the goal could cost in the future after inflation,
- whether the user is on track for their selected timeline,
- how much extra they may need to save, earn, or cut from expenses each month.

The MVP uses a minimal dark interface, simple goal presets, an "Other" goal option, common timeline choices such as 1 year and 1.5 years, and small info helpers that explain each field and result in plain language.

## Who It Is For

This MVP is for students, women and men managing household money, young earners, housewives, and middle-income families who want a plain-language planning tool before making a large purchase or savings commitment. It is designed for clarity over financial complexity and should not be treated as professional financial advice.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A modern browser such as Chrome, Edge, Firefox, or Safari

## Installation

From the project root:

```bash
npm install
```

## Start The App

```bash
npm run dev
```

Then open the local URL printed by Vite. By default this project uses:

```text
http://127.0.0.1:5173/
```

## Run Tests

```bash
npm test
```

## Build For Production

```bash
npm run build
```

The production build is written to `dist/`, which is excluded from source submission.

## Build For GitHub Pages

This repository is intended to deploy at:

```text
https://zohaakram.github.io/Personal_Goal_Planner/
```

Use this command so Vite generates asset paths for the repository subpath:

```bash
npm run build:pages
```

## Deployment

The app can be hosted as a static site. The initial deployment target is GitHub Pages using the `gh-pages` branch.

Deployment steps used:

1. Build with `npm run build:pages`.
2. Publish the generated `dist/` folder to the `gh-pages` branch.
3. Enable GitHub Pages for the repository from the `gh-pages` branch root.

## Project Structure

```text
.
├── docs/
│   ├── app-roles.md
│   ├── jobs-to-be-done.md
│   └── user-stories.md
├── src/
│   ├── lib/
│   │   ├── finance.ts
│   │   └── finance.test.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── transcripts/
├── README.md
└── package.json
```

## AI Tool And Model Used

- Tool: Codex desktop app
- Model: GPT-5 based Codex coding agent

## Manual Code Changes

All source files, tests, documentation, and project configuration were created during this initial MVP pass.

## Development Assumptions

- Currency is displayed in Pakistani rupees for the MVP.
- The selected target timeline controls "Savings by chosen time"; the estimated finish date may be earlier.
- Inflation affects both the future goal amount and monthly expenses.
- Expected raises affect monthly income gradually using a monthly equivalent of the annual raise rate.
- The calculator does not model investment returns, taxes, debt interest, windfalls, or one-time expenses.
- Results are estimates for personal planning and are not financial advice.
- The `transcripts/` folder is intentionally empty for now and reserved for future AI session exports.
