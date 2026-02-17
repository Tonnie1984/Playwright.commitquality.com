# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Architecture Rules (Non-Obvious Only)

- Fixture system creates circular dependency: `fixtures.ts` imports all pages, pages extend `BasePage` - be careful when adding new pages
- BasePage navigation uses `data-testid` selectors exclusively; navbar elements have specific `data-testid` attributes (`navbar-products`, `navbar-addproduct`, etc.)
- Page objects are singletons per test via fixtures; they share the same `page` instance injected by Playwright
- `PracticeGeneralComponentsPage.navigateTo()` bypasses baseURL with hardcoded absolute URL - architectural violation but required for that page
- All tests run with `fullyParallel: true` but `workers: 1` in CI - tests are isolated but serialized in CI environment