# Implementation Plan

- [x] 1. Set up database schema and migrations
  - Create PostgreSQL database tables for users, categories, transactions, weekly_budgets, carryovers, and achievements
  - Add indexes for performance optimization
  - Create database migration files
  - Set up Prisma ORM or similar for type-safe database access
  - _Requirements: 1.1, 1.7, 2.8, 10.8_

- [x] 2. Implement CSV upload and parsing functionality
  - [x] 2.1 Create CSVParserService with file validation
    - Implement parseCSV() method to extract transaction data
    - Add support for common bank CSV formats (Chase, Bank of America, Wells Fargo)
    - Implement validateCSV() to check file format and required columns
    - Add detectFormat() to identify bank-specific formats
    - _Requirements: 1.2, 1.3, 1.8_

  - [x] 2.2 Build CSV upload UI component
    - Create file picker with drag-and-drop support
    - Add upload progress indicator
    - Display parsing status and error messages
    - Implement transaction review table with editable categories
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

  - [x] 2.3 Implement duplicate detection
    - Create checkDuplicates() method in CSVParserService
    - Compare new transactions against existing ones by date, amount, and description
    - Build UI to highlight and skip duplicates
    - _Requirements: 1.10_

  - [x] 2.4 Create transaction save endpoint
    - Build POST /api/transactions endpoint
    - Validate transaction data
    - Save transactions to database with user_id
    - Return success response with transaction count
    - _Requirements: 1.7, 1.9_

- [x] 3. Build category management system
  - [x] 3.1 Create CategoryService with CRUD operations
    - Implement getActiveCategories() to fetch user's categories
    - Add createCategory() for custom categories
    - Build updateCategory() for editing category settings
    - Implement archiveCategory() for soft deletion
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.9, 7.10_

  - [x] 3.2 Implement auto-categorization logic
    - Create suggestCategory() method with pattern matching
    - Build keyword dictionary for common transaction types
    - Add machine learning model for improved accuracy (optional)
    - Test categorization accuracy with sample data
    - _Requirements: 1.4, 1.5_

  - [x] 3.3 Build category API endpoints
    - Create GET /api/categories for fetching categories
    - Add POST /api/categories for creating new categories
    - Build PATCH /api/categories/:id for updates
    - Implement DELETE /api/categories/:id for archiving
    - _Requirements: 7.1, 7.9, 7.10_

- [ ] 4. Implement budget calculation engine
  - [ ] 4.1 Create BudgetCalculationService core logic
    - Implement calculateMonthlyCeiling() using 3-month historical average
    - Build calculateWeeklyLimit() with formula: (monthlyCeiling / weeksInMonth) - carryover ± goals
    - Add calculateCarryover() to determine positive/negative carryover from previous week
    - Implement updateWeeklySpending() to track current week's spending
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 4.2 Build weekly budget initialization
    - Create job to calculate budgets for new week (runs every Monday)
    - Apply carryover from previous week automatically
    - Handle edge cases (first week, insufficient data)
    - Save weekly_budgets to database
    - _Requirements: 2.3, 2.4, 2.5, 2.9_

  - [ ] 4.3 Implement real-time spending updates
    - Create updateWeeklySpending() method triggered on new transactions
    - Recalculate remaining budget instantly
    - Update weekly_budgets table
    - Trigger WebSocket event for UI update
    - _Requirements: 3.1, 3.2, 3.3, 3.9_

  - [ ] 4.4 Add threshold detection system
    - Implement checkThresholds() to detect 80%, 90%, 100% spending levels
    - Create ThresholdAlert type with severity levels
    - Trigger notifications when thresholds are crossed
    - Prevent duplicate alerts for same threshold
    - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [ ] 5. Build carryover tracking system
  - [ ] 5.1 Create CarryoverService
    - Implement applyCarryover() to transfer amounts between weeks
    - Build getCarryoverHistory() for historical tracking
    - Add logic to handle positive accumulation
    - Implement negative carryover (deficit) tracking
    - _Requirements: 2.4, 2.5, 3.4_

  - [ ] 5.2 Implement micro-recovery plan
    - Create triggerRecoveryPlan() for negative carryover
    - Generate 2-3 recovery options (reduce other categories, spread deficit, adjust limit)
    - Build RecoveryPlan and RecoveryOption types
    - Save recovery plan to database for tracking
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 5.3 Add recovery plan UI
    - Create modal to display recovery options
    - Show empathetic messaging for overspending
    - Allow user to select and apply recovery option
    - Display confirmation of changes made
    - _Requirements: 6.2, 6.3, 6.6, 6.7, 6.8_

- [ ] 6. Create WeeklyBudgetCoach UI component
  - [ ] 6.1 Build main WeeklyBudgetCoach container
    - Create component with state management (Zustand or Context)
    - Fetch weekly budget data on mount
    - Display loading and error states
    - Show current week date range
    - _Requirements: 4.1, 4.2_

  - [ ] 6.2 Implement CategoryCard component
    - Display category name, emoji, and amounts
    - Build progress bar with color coding (green/yellow/orange/red)
    - Show percentage used and remaining amount
    - Add empathetic status message
    - Implement expand/collapse functionality
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

  - [ ] 6.3 Add real-time update functionality
    - Set up WebSocket connection for live updates
    - Listen for budget update events
    - Update UI without page refresh (< 1 second)
    - Handle connection failures gracefully
    - _Requirements: 3.3, 3.9, 10.7_

  - [ ] 6.4 Implement responsive design
    - Make layout work on mobile, tablet, and desktop
    - Use CSS Grid for category cards
    - Add touch-friendly interactions
    - Test on various screen sizes
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. Build DailySafeToSpend component
  - [ ] 7.1 Create daily calculation logic
    - Implement formula: remaining_week_budget / remaining_days_in_week
    - Handle edge cases (last day of week, zero remaining)
    - Calculate for each category
    - Update when spending changes
    - _Requirements: 5.1, 5.6, 5.7, 5.8_

  - [ ] 7.2 Build daily view UI
    - Create toggle between weekly and daily view
    - Display bar chart for last 7 days
    - Highlight days exceeding safe-to-spend
    - Add smooth animation transitions
    - Show "Back to Weekly" button
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.9, 5.10_

- [ ] 8. Implement category customization
  - [ ] 8.1 Create CustomizationModal component
    - Build modal with form fields (name, emoji, monthly ceiling)
    - Add emoji picker component
    - Implement currency input with validation
    - Add active/inactive toggle
    - Include delete button with confirmation dialog
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.10_

  - [ ] 8.2 Add user preferences for week start day
    - Create settings page or modal
    - Allow selection of week start day (Monday-Sunday)
    - Save preference to user profile
    - Recalculate all weekly periods when changed
    - _Requirements: 7.7, 7.8_

  - [ ] 8.3 Implement custom category creation
    - Add "Create Category" button
    - Build form for new category details
    - Set initial monthly ceiling
    - Save to database and refresh UI
    - _Requirements: 7.9_

- [ ] 9. Add empathetic messaging system
  - [ ] 9.1 Create message templates
    - Write templates for each status (good, warning, critical, over)
    - Add context variables (amount, percentage, category)
    - Create encouraging messages for under budget
    - Write supportive messages for overspending
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [ ] 9.2 Implement message generation logic
    - Create function to select appropriate template based on status
    - Replace variables with actual values
    - Add personality and warmth to messages
    - Test tone with various scenarios
    - _Requirements: 8.1, 8.10_

  - [ ] 9.3 Display messages in UI
    - Show messages in CategoryCard component
    - Update messages when status changes
    - Add emojis for visual appeal
    - Ensure messages are always supportive, never judgmental
    - _Requirements: 4.7, 4.8, 4.9, 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Build achievement system
  - [ ] 10.1 Create achievement tracking
    - Implement logic to detect 4-week streak under budget
    - Calculate total surplus over 4 weeks
    - Save achievement to database
    - Prevent duplicate achievements
    - _Requirements: 9.1, 9.2, 9.9_

  - [ ] 10.2 Build achievement notification
    - Create celebration modal with confetti animation
    - Display surplus amount and achievement message
    - Show three options: transfer to goal, increase limit, keep as buffer
    - _Requirements: 9.3, 9.4_

  - [ ] 10.3 Implement achievement actions
    - Add logic to transfer surplus to savings goal
    - Implement limit increase calculation and application
    - Add buffer to next week's carryover
    - Show confirmation of action taken
    - _Requirements: 9.5, 9.6, 9.7, 9.8_

  - [ ] 10.4 Create achievement history view
    - Build page or section to display past achievements
    - Show achievement badges and dates
    - Display streak statistics
    - Add motivational summary
    - _Requirements: 9.10_

- [ ] 11. Implement API endpoints
  - [ ] 11.1 Create budget endpoints
    - GET /api/budgets/weekly - Fetch current week's budgets
    - GET /api/budgets/history - Get historical budget data
    - PATCH /api/budgets/:id - Update budget settings
    - POST /api/budgets/recalculate - Force recalculation
    - _Requirements: 2.8, 7.6, 10.7_

  - [ ] 11.2 Build transaction endpoints
    - POST /api/transactions - Create new transaction
    - GET /api/transactions - List transactions with filters
    - PATCH /api/transactions/:id - Update transaction
    - DELETE /api/transactions/:id - Delete transaction
    - _Requirements: 1.7, 3.1, 3.2_

  - [ ] 11.3 Add carryover endpoints
    - GET /api/carryovers/:categoryId - Get carryover history
    - POST /api/carryovers/apply - Apply carryover to new week
    - POST /api/recovery-plan - Generate recovery plan
    - POST /api/recovery-plan/apply - Apply selected recovery option
    - _Requirements: 6.1, 6.4, 6.5_

- [ ] 12. Add notification system integration
  - [ ] 12.1 Create notification service
    - Build NotificationService with trigger methods
    - Implement notification types (threshold, achievement, recovery)
    - Add notification scheduling
    - Store notifications in database
    - _Requirements: 3.8, 6.2, 9.3, 10.7_

  - [ ] 12.2 Implement threshold notifications
    - Trigger notification at 80%, 90%, 100% spending
    - Include category name and remaining amount
    - Add "View Details" action
    - Prevent duplicate notifications
    - _Requirements: 3.8, 6.1, 6.2_

  - [ ] 12.3 Add achievement notifications
    - Send notification when 4-week streak achieved
    - Include celebration message and surplus amount
    - Add action buttons for achievement options
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 13. Implement data integration with other features
  - [ ] 13.1 Create integration interfaces
    - Define data contracts for Weekly Motivational Check
    - Add hooks for Predictive Notifications
    - Create data export for Major Expense Forecasts
    - Build integration with Spending Simulator
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 13.2 Add event system for feature communication
    - Implement event bus for cross-feature updates
    - Emit events on budget changes
    - Listen for events from other features
    - Ensure data consistency across features
    - _Requirements: 10.7, 10.8, 10.9, 10.10_

- [ ] 14. Add error handling and validation
  - [ ] 14.1 Implement error types and handlers
    - Create BudgetError class with error codes
    - Add user-friendly error messages
    - Implement retry logic for transient errors
    - Log errors for debugging
    - _Requirements: 1.8, 2.7, 2.9_

  - [ ] 14.2 Add input validation
    - Validate CSV file format and size
    - Check currency amounts (no negatives for budgets)
    - Validate date ranges
    - Sanitize user inputs
    - _Requirements: 1.8, 7.2, 7.3_

  - [ ] 14.3 Build error UI components
    - Create error message component
    - Add inline validation errors
    - Build error boundary for React components
    - Show helpful error recovery suggestions
    - _Requirements: 1.8, 4.1_

- [ ] 15. Optimize performance
  - [ ] 15.1 Add database optimizations
    - Create indexes on frequently queried columns
    - Implement connection pooling
    - Add query result caching (5-minute TTL for budgets)
    - Use database transactions for consistency
    - _Requirements: 2.8, 3.9_

  - [ ] 15.2 Implement frontend optimizations
    - Add optimistic UI updates
    - Implement debouncing for rapid updates
    - Use React.memo for expensive components
    - Add code splitting for modals
    - _Requirements: 3.3, 3.9_

  - [ ] 15.3 Set up WebSocket for real-time updates
    - Configure WebSocket server
    - Implement connection management
    - Add reconnection logic
    - Batch updates every 2 seconds
    - Fallback to polling if WebSocket fails
    - _Requirements: 3.3, 3.9, 10.7_

- [ ] 16. Add accessibility features
  - [ ] 16.1 Implement keyboard navigation
    - Make all interactive elements keyboard accessible
    - Add focus indicators
    - Support Tab, Enter, and Escape keys
    - Test with keyboard-only navigation
    - _Requirements: 4.10, 7.1_

  - [ ] 16.2 Add screen reader support
    - Add ARIA labels to all components
    - Announce budget status changes
    - Describe progress bar percentages
    - Test with screen readers (NVDA, JAWS)
    - _Requirements: 4.3, 4.4, 4.5_

  - [ ] 16.3 Ensure visual accessibility
    - Use high contrast colors
    - Provide text alternatives for emojis
    - Ensure minimum 16px font size
    - Test with color-blind simulators
    - _Requirements: 4.6, 4.7, 4.8_

- [ ] 17. Write documentation
  - [ ] 17.1 Create user documentation
    - Write guide for uploading CSV files
    - Document how weekly budgets work
    - Explain carryover system
    - Add FAQ section
    - _Requirements: 1.1, 2.1, 2.4_

  - [ ] 17.2 Write developer documentation
    - Document API endpoints with examples
    - Add code comments for complex logic
    - Create architecture diagrams
    - Write contribution guidelines
    - _Requirements: All_

- [ ] 18. Test and deploy
  - [ ] 18.1 Write automated tests
    - Create unit tests for services (80%+ coverage)
    - Add integration tests for API endpoints
    - Write E2E tests for critical user flows
    - Add performance tests for calculations
    - _Requirements: All_

  - [ ] 18.2 Perform manual testing
    - Test CSV upload with various formats
    - Verify budget calculations are accurate
    - Test real-time updates
    - Check mobile responsiveness
    - Verify accessibility features
    - _Requirements: All_

  - [ ] 18.3 Deploy to production
    - Set up production database
    - Configure environment variables
    - Deploy backend services
    - Deploy frontend application
    - Set up monitoring and logging
    - _Requirements: All_
