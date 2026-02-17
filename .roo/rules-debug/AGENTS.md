# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Debug Rules (Non-Obvious Only)

- Screenshots are saved to `tests/screenshots/` (relative to project root) - ensure this directory exists
- Playwright config uses `trace: 'retain-on-failure'` and `video: 'retain-on-failure'` - check these on failures
- Tests may fail silently if baseURL is not set correctly; verify `playwright.config.ts` has `baseURL: 'https://commitquality.com/'`
- `PracticeGeneralComponentsPage.navigateTo()` hardcodes the full URL; it does NOT use relative paths or baseURL