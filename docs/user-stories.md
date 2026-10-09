# User Stories

## S-1: Select A Currency

Job: J-7

Status: Implemented

As an everyday goal planner, I want to choose a currency, so that all money values are displayed in a familiar format.

Acceptance criteria:

- Given the app is open, when I choose PKR, USD, GBP, EUR, AED, SAR, INR, or BDT, then result values are formatted using that selected currency.
- Given I change currency, when a preset goal is selected, then the preset goal amount changes to that currency's preset amount.
- Given I change currency, when I had selected Other as the goal type, then my custom goal amount is not converted or replaced.
- Given I change currency, when the inflation rate field updates, then it uses the selected currency's suggested inflation default as an editable planning assumption.
- Given the app formats currency, when a calculated money value is negative, then it displays as zero because the formatter clamps display values to zero.

## S-2: Choose A Preset Goal

Job: J-1

Status: Implemented

As an everyday goal planner, I want to choose a common goal, so that I can start with a reasonable sample goal amount.

Acceptance criteria:

- Given the goal type is Car, House down payment, or Emergency fund, when I select it, then the goal name and goal amount update to the preset for the selected currency.
- Given I change from one preset to another, when the selection changes, then the calculation updates immediately.
- Given a preset goal is selected, when I change currency, then the preset amount updates for the new currency.

## S-3: Enter A Custom Goal

Job: J-1

Status: Implemented

As an everyday goal planner, I want to enter my own goal name, so that I can plan for goals outside the preset list.

Acceptance criteria:

- Given I select Other, when the custom goal field appears, then I can type a goal name.
- Given I type a custom goal name, when the form updates, then the displayed goal name uses my typed text where the app references the goal internally.
- Given I select Other, when the goal amount is shown, then it uses the Other preset amount for the selected currency until I edit it.

## S-4: Enter Money Assumptions

Job: J-1

Status: Implemented

As an everyday goal planner, I want to enter price, savings, income, and spending, so that the app can estimate my savings path.

Acceptance criteria:

- Given I edit price today, savings now, monthly income, or monthly spending, when the value is numeric, then calculations update immediately.
- Given I enter commas in a numeric field, when the value is parsed, then commas are ignored.
- Given I leave a required numeric field empty or enter non-numeric text, when the app validates the form, then it shows a field-level validation message and pauses result estimates.
- Given I enter a negative numeric value, when the app validates the form, then it shows that the field cannot be negative and pauses result estimates.
- Given I enter a very large number above the supported limit, when the app validates the form, then it shows that the value is too large and pauses result estimates.
- Given monthly spending is higher than monthly income, when the app validates the form, then it shows a field-level message and pauses result estimates.
- Given I leave optional savings or growth fields empty, when the app validates the form, then the field is allowed and treated as zero.

## S-5: Enter Growth Assumptions

Job: J-3

Status: Implemented

As an everyday goal planner, I want to enter yearly income increase and inflation rate, so that the projection can account for changing income and prices.

Acceptance criteria:

- Given I edit yearly income increase, when the value is numeric, then projected monthly income grows using a monthly equivalent of that annual percentage.
- Given I edit inflation rate, when the value is numeric, then projected monthly expenses and future goal price grow using a monthly equivalent of that annual percentage.
- Given I select a currency, when the app updates the inflation rate field, then it uses the suggested default for that currency as an editable planning assumption.
- Given I enter a negative growth percentage, when the app validates the form, then it shows that the value cannot be negative and pauses result estimates.
- Given I enter a growth percentage above 100, when the app validates the form, then it shows that the value is too large and pauses result estimates.
- Given I leave a growth value empty, when the app validates the form, then that value is allowed and treated as zero.
- Given I enter non-numeric text for a growth value, when the app validates the form, then it shows a field-level validation message and pauses result estimates.

## S-6: Choose A Target Timeline

Job: J-4

Status: Implemented

As an everyday goal planner, I want to choose a target timeline, so that I can check whether my plan reaches the goal by that time.

Acceptance criteria:

- Given I choose 6 months, 1 year, 1.5 years, 2 years, 3 years, or 5 years, when the selection changes, then target months update to 6, 12, 18, 24, 36, or 60.
- Given I choose Custom months, when the custom months input appears, then I can type a custom number of months.
- Given I enter zero, a negative value, an empty value, or non-numeric text for custom months, when the app validates the form, then it shows a field-level validation message and pauses result estimates.
- Given I enter a decimal custom month value, when the app calculates, then the target month value is rounded to the nearest month.
- Given I enter custom months above 600, when the app validates the form, then it shows that the value is too large and pauses result estimates.
- Given I change the timeline, when the result updates, then on-track status, future price, projected savings, and monthly gap update immediately.

## S-7: See Whether The Plan Is On Track

Job: J-4

Status: Implemented

As an everyday goal planner, I want a clear on-track message, so that I can quickly understand whether my current plan reaches my chosen time.

Acceptance criteria:

- Given projected savings at the chosen time are greater than or equal to the future goal price, when results render, then the app shows that the current plan can work.
- Given projected savings at the chosen time are less than the future goal price, when results render, then the app shows that I may need to save or earn more.
- Given the result is not on track, when the badge appears, then it shows the calculated monthly shortfall formatted in the selected currency.

## S-8: See Estimated Finish Date

Job: J-1

Status: Implemented

As an everyday goal planner, I want to see when I can buy the goal, so that I can understand the likely timing.

Acceptance criteria:

- Given current savings are already greater than or equal to the goal amount, when the app calculates, then months to goal is zero.
- Given projected savings reach or exceed future goal price within the calculation window, when results render, then the app shows a month and year as the estimated finish date.
- Given projected savings do not reach future goal price within 600 months, when results render, then the app shows Not yet.
- Given the app formats the finish date, when it displays the date, then it uses month and year format.

## S-9: See Future Goal Price

Job: J-3

Status: Implemented

As an everyday goal planner, I want to see the expected future price, so that I can plan for price increases.

Acceptance criteria:

- Given a goal amount and inflation rate, when the app calculates, then future goal price is the goal amount grown by the monthly equivalent of the inflation rate over the target months.
- Given inflation rate is zero, when the app calculates, then future goal price equals the goal amount.
- Given the selected currency changes, when the result renders, then the future price is formatted in the selected currency.

## S-10: See Monthly Saving Capacity

Job: J-1

Status: Implemented

As an everyday goal planner, I want to see how much money is left monthly, so that I understand my current saving capacity.

Acceptance criteria:

- Given monthly income and monthly spending are entered, when the app calculates, then money left monthly equals monthly income minus monthly spending.
- Given monthly spending is greater than monthly income, when the app calculates, then the underlying monthly surplus is negative.
- Given a money result is formatted and the value is negative, when displayed through the currency formatter, then it appears as zero.

## S-11: See Savings By Chosen Time

Job: J-4

Status: Implemented

As an everyday goal planner, I want to see projected savings by my chosen time, so that I can compare my expected savings with the future goal price.

Acceptance criteria:

- Given current savings and monthly contribution projections, when the app calculates, then projected savings by chosen time equals the projection value for the selected target month.
- Given income increase is greater than zero, when the app projects savings, then monthly income increases over time.
- Given inflation rate is greater than zero, when the app projects savings, then monthly expenses increase over time.
- Given the target month is beyond the stored projection list, when the app calculates, then it uses the last available projection point.

## S-12: See Monthly Gap Recommendations

Job: J-5

Status: Implemented

As an everyday goal planner, I want to see how much extra I need each month, so that I can decide whether to save more, earn more, or spend less.

Acceptance criteria:

- Given the plan is short at the chosen target time, when results render, then the app shows Save extra, Earn extra, and Spend less recommendations.
- Given extra needed per month is calculated, when recommendations render, then Save extra, Earn extra, and Spend less show the same monthly amount.
- Given the plan reaches the chosen timeline, when results render, then the app shows a success note instead of the three recommendation cards.
- Given the monthly gap is shown, when currency changes, then the amount is formatted in the selected currency.

## S-13: Use Helper Text

Job: J-6

Status: Implemented

As an informal financial guide, I want helper explanations for inputs and results, so that I can explain the calculator to a first-time user.

Acceptance criteria:

- Given an input label has an info icon, when the user hovers or focuses it, then helper text is available.
- Given a result metric has an info icon, when the user hovers or focuses it, then helper text explains the meaning or formula.
- Given recommendation labels have info icons, when the user hovers or focuses them, then helper text explains the recommendation.

## S-14: Show Validation Messages

Job: J-1

Status: Implemented

As an everyday goal planner, I want visible validation messages when I make input mistakes, so that I know what to fix before trusting the estimate.

Acceptance criteria:

- Given a required numeric input is empty, when the app validates the form, then it shows a field-level message.
- Given a numeric input contains non-numeric text, when the app validates the form, then it shows a field-level message.
- Given a negative input is entered, when the app validates the form, then it shows a field-level message.
- Given monthly spending is higher than monthly income, when the app validates the form, then it shows that spending cannot be more than income for this MVP.
- Given an amount is above the supported money limit, when the app validates the form, then it shows a field-level message.
- Given a percentage is above 100, when the app validates the form, then it shows a field-level message.
- Given custom months is above 600, when the app validates the form, then it shows a field-level message.
- Given any validation message is active, when results would otherwise render, then the app shows a correction summary instead of the estimate.

## S-15: Convert Currency Amounts Automatically

Job: J-7

Status: Not implemented

As an everyday goal planner, I want the app to convert existing amounts when I change currency, so that the same financial plan is translated across currencies.

Acceptance criteria:

- Given I have entered custom amounts, when I change currency, then the app should convert my entered values using an exchange rate.
- Given no exchange-rate source exists in the app, when currency changes now, then custom amounts remain numerically unchanged and only formatting changes.

## S-16: Save Multiple Goals

Job: J-2

Status: Not implemented

As a household planning partner, I want to save multiple goals, so that my household can compare them later.

Acceptance criteria:

- Given I create a goal estimate, when I leave or refresh the app, then the app should persist the goal for later review.
- Given the current implementation has no persistence, when I refresh the page, then the app resets to its initial in-memory state.

## S-17: Provide Advanced Validation Rules

Job: J-6

Status: Not implemented

As an informal financial guide, I want advanced contextual validation rules beyond the MVP happy flow, so that users understand whether their numbers are realistic for their situation.

Acceptance criteria:

- Given a user enters realistic-looking but financially unusual values, when the app validates the form, then it should explain why the values may need review.
- Given monthly spending is equal to monthly income, when the app validates the form, then it should explain that the plan has no monthly leftover unless savings already cover the goal.
- Given the current MVP, when spending is equal to income, then the app allows the input because the happy-flow assumption is income greater than or equal to spending.
