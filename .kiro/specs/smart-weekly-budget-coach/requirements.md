# Requirements Document

## Introduction

The Smart Weekly Budget Coach is a foundational feature of Financial Helm that helps users understand exactly how much they can spend each week on individual spending categories (e.g., Food Delivery, Shopping, Entertainment). This feature addresses the core problem of "blind spending" anxiety by providing clear, actionable weekly spending limits with intelligent carryover tracking and real-time updates.

Unlike traditional monthly budgets that feel abstract and distant, the Smart Weekly Budget Coach breaks down spending into manageable weekly chunks, making it easier for users to stay on track. The system intelligently handles unspent amounts by rolling them forward (positive accumulation) and triggers supportive recovery plans when users overspend, all delivered through empathetic, non-judgmental messaging.

This feature serves as the foundation for other Financial Helm features, providing the baseline data for Weekly Motivational Checks, Major Expense Forecasts, and Predictive Notifications.

## Requirements

### Requirement 1: CSV Data Import and Category Management

**User Story:** As a user, I want to upload my bank transaction CSV files and have them automatically categorized, so that I can start tracking my spending without manual data entry.

#### Acceptance Criteria

1. WHEN a user navigates to the dashboard THEN the system SHALL display a prominent "Upload CSV" button if no transaction data exists
2. WHEN a user clicks "Upload CSV" THEN the system SHALL open a file picker that accepts .csv file formats
3. WHEN a user selects a valid CSV file THEN the system SHALL parse the file and extract transaction data (date, description, amount, type)
4. WHEN the system parses transactions THEN it SHALL automatically suggest categories based on transaction descriptions using pattern matching
5. WHEN automatic categorization is complete THEN the system SHALL display a review screen showing all transactions with suggested categories
6. WHEN a user reviews suggested categories THEN they SHALL be able to modify any category assignment before confirming
7. WHEN a user confirms categories THEN the system SHALL save all transactions to the database with their assigned categories
8. IF a CSV file is invalid or improperly formatted THEN the system SHALL display a clear error message explaining what's wrong
9. WHEN a user has uploaded at least one month of data THEN the system SHALL enable the Smart Weekly Budget Coach feature
10. WHEN a user uploads additional CSV files THEN the system SHALL merge new transactions with existing data without creating duplicates

### Requirement 2: Weekly Budget Limit Calculation

**User Story:** As a user, I want the system to automatically calculate how much I can spend each week in each category, so that I have clear spending guidelines without doing complex math.

#### Acceptance Criteria

1. WHEN a user has at least one month of transaction history THEN the system SHALL calculate a monthly spending ceiling for each category based on historical average
2. WHEN calculating weekly limits THEN the system SHALL use the formula: `week_limit = (month_ceiling / number_of_weeks_in_month) - carry_over ± goal_adjustments`
3. WHEN a new week begins (Monday by default) THEN the system SHALL recalculate weekly limits for all active categories
4. WHEN a user has unspent budget from the previous week THEN the system SHALL add that amount to the current week's limit (positive carryover)
5. WHEN a user overspent in the previous week THEN the system SHALL subtract that amount from the current week's limit (negative carryover)
6. WHEN a user has active savings goals THEN the system SHALL adjust weekly limits to accommodate goal contributions
7. WHEN calculating limits THEN the system SHALL ensure no weekly limit goes below zero
8. WHEN weekly limits are calculated THEN the system SHALL store them in the database with timestamps
9. IF a user has insufficient historical data (less than 4 weeks) THEN the system SHALL use available data and display a notice that accuracy will improve over time
10. WHEN a user manually adjusts a category's monthly ceiling THEN the system SHALL recalculate all future weekly limits for that category

### Requirement 3: Real-Time Spending Tracking and Updates

**User Story:** As a user, I want to see my remaining weekly budget update in real-time as I add transactions, so that I always know how much I have left to spend.

#### Acceptance Criteria

1. WHEN a user adds a new transaction (via CSV or manual entry) THEN the system SHALL immediately update the spent amount for that category
2. WHEN spending is updated THEN the system SHALL recalculate the remaining budget: `remaining = week_limit - spent_this_week`
3. WHEN remaining budget changes THEN the system SHALL update the UI within 1 second without requiring a page refresh
4. WHEN a user spends money THEN the system SHALL update the carryover amount for the next week
5. WHEN remaining budget reaches 80% spent THEN the system SHALL change the visual indicator to yellow (warning state)
6. WHEN remaining budget reaches 90% spent THEN the system SHALL change the visual indicator to red (critical state)
7. WHEN a user goes over their weekly limit THEN the system SHALL display the overage amount clearly
8. WHEN an overage occurs THEN the system SHALL trigger a notification asking if the user wants to see recovery options
9. WHEN tracking spending THEN the system SHALL only count transactions from the current week (Monday-Sunday by default)
10. WHEN the week rolls over THEN the system SHALL reset the spent amount to zero and apply carryover to the new week's limit

### Requirement 4: Weekly Budget Coach UI Display

**User Story:** As a user, I want to see my weekly spending limits displayed clearly on my dashboard with visual progress indicators, so that I can quickly understand my spending status at a glance.

#### Acceptance Criteria

1. WHEN a user views the dashboard THEN the system SHALL display a "Weekly Budget Coach" card prominently near the top
2. WHEN displaying the coach card THEN it SHALL show all active spending categories with their weekly limits
3. WHEN showing a category THEN it SHALL display: category name, emoji icon, spent amount, remaining amount, and weekly limit
4. WHEN showing spending progress THEN it SHALL use a horizontal progress bar with color coding (green <80%, yellow 80-90%, red >90%)
5. WHEN a user has spent money THEN the progress bar SHALL fill proportionally to show percentage used
6. WHEN displaying amounts THEN the system SHALL format currency according to user's locale (default: USD)
7. WHEN a category is under budget THEN it SHALL display an encouraging message like "Great balance! 👍"
8. WHEN a category is approaching the limit THEN it SHALL display a gentle warning like "Approaching limit ⚡"
9. WHEN a category is over budget THEN it SHALL display a supportive message like "Let's adjust together 🤝"
10. WHEN a user taps a category card THEN it SHALL expand to show detailed breakdown and "Customize" button

### Requirement 5: Daily Safe-to-Spend Calculator

**User Story:** As a user, I want to see how much I can safely spend per day for the rest of the week, so that I can pace my spending evenly.

#### Acceptance Criteria

1. WHEN displaying a weekly budget THEN the system SHALL calculate daily safe-to-spend: `safe_to_spend_today = remaining_week_budget / remaining_days_in_week`
2. WHEN showing daily amount THEN it SHALL display in smaller text below the weekly limit (e.g., "≈ €30/day")
3. WHEN a user taps the daily amount THEN it SHALL switch to a "day view" showing spending for each of the last 7 days
4. WHEN in day view THEN it SHALL display a bar chart with daily spending amounts
5. WHEN in day view THEN it SHALL highlight days that exceeded the daily safe-to-spend amount
6. WHEN calculating daily amount THEN it SHALL only divide by remaining days (not including today if it's late in the day)
7. WHEN it's the last day of the week THEN it SHALL show the full remaining amount as available for that day
8. WHEN daily safe-to-spend is calculated THEN it SHALL never show a negative number (minimum: €0)
9. WHEN a user switches between weekly and daily views THEN the transition SHALL be smooth with animation
10. WHEN in daily view THEN a user SHALL be able to tap "Back to Weekly" to return to the main view

### Requirement 6: Micro-Recovery Plan for Overspending

**User Story:** As a user, when I overspend in a category, I want the system to help me get back on track with a simple recovery plan, so that I don't feel overwhelmed or judged.

#### Acceptance Criteria

1. WHEN a user's carryover becomes negative (overspending) THEN the system SHALL trigger a micro-recovery plan
2. WHEN triggering recovery THEN the system SHALL send a notification with empathetic messaging (e.g., "Sometimes we overspend 🤷 Let's get back on track together")
3. WHEN displaying recovery options THEN the system SHALL suggest 2-3 practical solutions
4. WHEN suggesting solutions THEN options SHALL include: reduce spending in another category, adjust next week's limit, or spread the deficit over multiple weeks
5. WHEN a user selects a recovery option THEN the system SHALL automatically adjust relevant budgets
6. WHEN recovery adjustments are made THEN the system SHALL show a confirmation message explaining what changed
7. WHEN a user dismisses the recovery plan THEN the system SHALL not show it again for that specific overspending event
8. WHEN recovery is in progress THEN the system SHALL track progress and celebrate when the user gets back on track
9. IF a user overspends 3 weeks in a row in the same category THEN the system SHALL suggest increasing that category's monthly ceiling
10. WHEN suggesting ceiling increases THEN the system SHALL explain where the extra budget could come from (other categories or goals)

### Requirement 7: Category Customization and Preferences

**User Story:** As a user, I want to customize my budget categories, set my own limits, and choose which day my week starts, so that the system fits my personal financial situation.

#### Acceptance Criteria

1. WHEN a user taps "Details/Customize" on a category THEN the system SHALL open a customization modal
2. WHEN in customization mode THEN the user SHALL be able to edit the monthly ceiling amount
3. WHEN in customization mode THEN the user SHALL be able to rename the category
4. WHEN in customization mode THEN the user SHALL be able to change the category emoji icon
5. WHEN in customization mode THEN the user SHALL be able to toggle the category active/inactive
6. WHEN a user saves customization changes THEN the system SHALL recalculate weekly limits immediately
7. WHEN a user accesses settings THEN they SHALL be able to choose their week start day (Monday-Sunday)
8. WHEN week start day changes THEN the system SHALL recalculate all weekly periods and limits
9. WHEN a user creates a new custom category THEN the system SHALL allow them to set an initial monthly ceiling
10. WHEN a user deletes a category THEN the system SHALL archive it (not permanently delete) and ask if they want to reassign existing transactions

### Requirement 8: Empathetic Messaging and Tone

**User Story:** As a user, I want all budget-related messages to be supportive and non-judgmental, so that I feel encouraged rather than criticized about my spending.

#### Acceptance Criteria

1. WHEN displaying any budget message THEN the system SHALL use warm, friendly language without blame
2. WHEN a user is under budget THEN messages SHALL be encouraging (e.g., "You still have €22: treat yourself to a worry-free lunch out 🍽️")
3. WHEN a user is approaching their limit THEN messages SHALL be gentle reminders (e.g., "You're doing great! Just €15 left for the week")
4. WHEN a user goes over budget THEN messages SHALL be supportive (e.g., "It happens! Let's look at options together")
5. WHEN suggesting budget adjustments THEN the system SHALL always ask for confirmation (e.g., "Does that sound okay or do you want to adjust it?")
6. WHEN celebrating achievements THEN messages SHALL be genuine and specific (e.g., "4 weeks under budget! 🎉 You're building great habits")
7. WHEN providing financial advice THEN the system SHALL frame it as suggestions, not commands
8. WHEN a user makes progress THEN the system SHALL acknowledge it with positive reinforcement
9. WHEN displaying numbers THEN the system SHALL add context to make them meaningful (e.g., "€30 saved = 3 coffees ☕")
10. WHEN tone is generated THEN it SHALL adapt to user's engagement level (more encouraging if struggling, more celebratory if succeeding)

### Requirement 9: Four-Week Achievement Bonus

**User Story:** As a user, when I stay under budget for 4 consecutive weeks, I want to be rewarded with options to save my surplus or adjust my limits, so that I feel motivated to maintain good habits.

#### Acceptance Criteria

1. WHEN a user stays under their weekly limit for 4 consecutive weeks in a category THEN the system SHALL trigger an achievement notification
2. WHEN achievement is triggered THEN the system SHALL calculate total surplus saved over the 4 weeks
3. WHEN displaying achievement THEN the system SHALL show a celebration message with the surplus amount
4. WHEN showing options THEN the system SHALL offer to: transfer surplus to a savings goal, keep it as buffer, or increase the category limit slightly
5. WHEN a user chooses to transfer to savings THEN the system SHALL show available goals and let them select one
6. WHEN transfer is confirmed THEN the system SHALL move the amount to the selected goal and show confirmation
7. WHEN a user chooses to increase the limit THEN the system SHALL suggest a new monthly ceiling based on the surplus
8. WHEN a user chooses to keep as buffer THEN the system SHALL add it to next week's carryover
9. WHEN achievement is celebrated THEN the system SHALL record it in the user's achievement history
10. WHEN a user views their profile THEN they SHALL be able to see all past achievements and streaks

### Requirement 10: Integration with Other Features

**User Story:** As a user, I want my weekly budget data to seamlessly integrate with other Financial Helm features, so that I have a cohesive financial management experience.

#### Acceptance Criteria

1. WHEN weekly limits are calculated THEN the data SHALL be available to the Weekly Motivational Check feature
2. WHEN a user overspends THEN the system SHALL trigger Predictive Notifications with relevant alerts
3. WHEN Major Expense Forecasts are created THEN they SHALL automatically adjust weekly limits to accommodate savings
4. WHEN a user runs a Spending Simulator THEN it SHALL use current weekly limits as baseline data
5. WHEN Habit Analysis detects patterns THEN it SHALL suggest weekly limit adjustments
6. WHEN a user sets a financial goal THEN the system SHALL ask if they want to adjust weekly budgets to support it
7. WHEN weekly data changes THEN all dependent features SHALL receive updates within 2 seconds
8. WHEN displaying insights THEN the system SHALL cross-reference weekly budget data with other features
9. WHEN a user receives a notification THEN it SHALL include relevant weekly budget context
10. WHEN features interact THEN the system SHALL maintain data consistency across all components

## Success Metrics

- 80%+ of users stay within weekly limits after 3 weeks of use
- Average reduction in monthly overspending: 25%+
- Weekly retention on Coach card opening: 70%+
- User satisfaction rating for empathetic messaging: 4.5/5+
- Time to understand spending status: <5 seconds
- Achievement unlock rate (4-week streak): 40%+ of active users

## Technical Constraints

- Weekly limit calculations must complete in <500ms
- UI updates must reflect spending changes within 1 second
- System must support at least 24 months of historical transaction data
- CSV parsing must handle files up to 10,000 transactions
- All currency calculations must use decimal precision (no floating point errors)
- System must work offline with cached data, syncing when connection restored
