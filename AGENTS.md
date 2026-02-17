# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands
- No npm scripts defined. Use `npx playwright test` directly.
- Run single test: `npx playwright test tests/loginPageTests.spec.ts:10`
- Run tests by title: `npx playwright test -g "should successfully fill username field"`

## Critical Project Conventions

### Page Object Structure
- Page classes in `tests/Pages/` (capitalized directory name - unusual convention)
- All pages extend `BasePage` which uses `data-testid` selectors for navigation
- Page locators use `getByTestId()` for elements with `data-testid` attributes
- Some pages use `getByRole()` with specific ARIA labels (e.g., `{ name: 'Filter by product name' }`)

### Fixtures
- `tests/Support/fixtures.ts` injects ALL page objects into EVERY test via `test.extend`
- Even if a test only needs `loginPage`, all fixtures (homePage, addProductPage, etc.) are available
- Import using `{ test, expect } from './Support/fixtures'` (not from '@playwright/test')

### Date Handling
- [`AddProductPage.enterDateStocked()`](tests/Pages/AddProductPage.ts:37-47) transforms dates: DD/MM/YYYY → YYYY-MM-DD
- The slash format is expected by the method and automatically converted

### Navigation Patterns
- [`PracticeGeneralComponentsPage.navigateTo()`](tests/Pages/PracticeGeneralComponentsPage.ts:68) hardcodes: `https://commitquality.com/practice-general-components`
- Base pages use relative paths: `await this.page.goto("/")`, `await this.page.goto("/login")`
- `playwright.config.ts` has `baseURL: 'https://commitquality.com/'`

### Test Structure
- Tests use `test.describe()` for grouping
- `test.beforeEach()` commonly used with fixture injection
- Soft assertions available via `expect.soft()`

### Selector Strategy
- Prefer `data-testid` attributes throughout the app
- Some elements accessed by `getByRole()` with exact name matching
- Locators like `page.locator('.error')` used for generic error messages

## Gotchas
- No package.json scripts → don't look for `npm test` or `npm run test`
- Tests may reference screenshots paths like `tests/screenshots/` - ensure directory exists
- `practiceGeneralComponentsTests.spec.ts` screenshots are saved to `tests/screenshots/` (relative to project root)
- `showMoreButton` appears on both HomePage and AddProductPage - be careful which page object you're using