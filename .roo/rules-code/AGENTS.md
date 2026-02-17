# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Coding Rules (Non-Obvious Only)

- Page classes MUST be in `tests/Pages/` directory (capitalized - unusual convention)
- All page classes extend `BasePage` which provides navigation via `data-testid` selectors
- Use `getByTestId()` for elements with `data-testid` attributes; use `getByRole()` only when exact name matching is required
- `showMoreButton` exists on both HomePage and AddProductPage - be careful which page object you reference
- Date handling: [`AddProductPage.enterDateStocked()`](tests/Pages/AddProductPage.ts:37-47) converts DD/MM/YYYY to YYYY-MM-DD automatically - pass dates in slash format