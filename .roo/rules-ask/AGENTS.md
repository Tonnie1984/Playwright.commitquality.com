# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Documentation Rules (Non-Obvious Only)

- `tests/Support/fixtures.ts` injects ALL page objects into EVERY test via `test.extend` - even unused fixtures are available
- Import test utilities using `{ test, expect } from './Support/fixtures'` NOT from `'@playwright/test'` directly
- The capitalized `tests/Pages/` directory is NOT a typo - it's the actual page object location
- No npm scripts exist; all commands use `npx playwright test` directly with specific arguments
- Test files use `.spec.ts` extension but are NOT in separate `__tests__` folders - they're in `tests/` root