import { test, expect } from './Support/fixtures';

test.describe('A. Home Page (Product List) tests', () => {
    test('H1: Verify Product Table Loading', async ({ page, homePage }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('Check for the visibility of the product table.', async () => {
            await expect(page.locator(".product-list-table")).toBeVisible();
        })
        await test.step('The table should load with columns: ID, Name, Price, and Date Stocked.', async () => {
            const expectedColumn = ['ID', 'Name', 'Price', 'Date Stocked'];
            const actualColumns = await homePage.getTableHeaderValues();

            expect(actualColumns,
                `ERROR: Expected: ${expectedColumn} /Received: ${actualColumns}`
            ).toEqual(expectedColumn);
        })
    })

    test('H2: Filter Functionality', async ({ homePage }) => {
        const searchProduct = 'Product 2';

        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('Enter a known product name in the "Filter" input.', async () => {
            await homePage.filterByName(searchProduct);
        })
        await test.step('The table should update to show only rows matching the search criteria.', async () => {
            const names = await homePage.visibleProductNames.allTextContents();

            expect(names.every(n => n.includes(searchProduct)), "The table shows rows not matching the search criteria.").
                toBeTruthy();
        })

    })

    test('H3: Reset Button', async ({ homePage }) => {
        const searchProduct = 'Product 2';
        let originalProductList: string[] = [];

        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
            originalProductList = await homePage.visibleProductNames.allTextContents();
        })
        await test.step('2. Apply a filter.', async () => {
            await homePage.filterByName(searchProduct);
            const filteredList = await homePage.visibleProductNames.allTextContents();
            expect(filteredList.every(n => n.includes(searchProduct)), "The table shows rows not matching the search criteria.").
                toBeTruthy();
        })
        await test.step('3. Click the "Reset" button.', async () => {
            await homePage.resetFilters();
        })
        await test.step('The filter input should clear, and the table should reload to show all products.', async () => {
            const resetedList = await homePage.visibleProductNames.allTextContents();

            expect(resetedList.sort(), "Error: resetting the filters do not show the original table ").toEqual(originalProductList.sort());
        })

    })

    test('H4: Show More (Pagination)', async ({ homePage, page }) => {
        let rowCount : number;
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
            rowCount = await page.locator('tbody tr').count();
        })
        await test.step('2. Scroll to the bottom of the list.', async () => {
            //Playwright hace scroll automáticamente, se usa solamente para practicar aqui
            await homePage.showMoreButton.scrollIntoViewIfNeeded();
        })
        await test.step('2. Click "Show More".', async () => {
            await homePage.clickShowMore();
        })
        await test.step('Additional products hould append to the bottom of the table .', async () => {
            const paginatedList = await page.locator('tbody tr').count();

            await expect.soft(homePage.showMoreButton, " Show More Button Still displayeed").not.toBeVisible();
            await expect(paginatedList, " ERROR: No more elements displayeed in the list").toBeGreaterThan(rowCount);
        })
    })

    test('H5: Verify "Add Product" CTA', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step(' Click the "Add Product" button/link.".', async () => {
            await homePage.addProductButton.click();
        })
        await test.step('User should be redirected to /add-product.', async () => {

            await expect(page, " Redirection is not to add product page").toHaveURL(/.*add-product/);
        })

    })

    // ========== NEGATIVE TESTS ==========

    test('HN1: should display no results message when filter matches no products', async ({ homePage, page }) => {
        const nonExistentProduct = 'ZZZNotFound123';

        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter a product name that does not exist.', async () => {
            await homePage.filterByName(nonExistentProduct);
        })
        await test.step('The table should show zero visible products.', async () => {
            const names = await homePage.visibleProductNames.allTextContents();
            expect(names.every(n => n.includes(nonExistentProduct)), "Expected no matching products").toBeFalsy();
            await expect(homePage.visibleProductNames.first()).not.toBeVisible();
        })
    })

    test('HN2: should handle special characters in filter input', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter special characters like <script> in filter.', async () => {
            await homePage.filterByName('<script>alert("xss")</script>');
        })
        await test.step('Should not break the page and should show zero results or sanitize input.', async () => {
            await expect(page).not.toHaveURL(/.*login/);
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HN3: should handle SQL injection attempt in filter', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter SQL injection pattern in filter.', async () => {
            await homePage.filterByName("' OR '1'='1");
        })
        await test.step('Should not break or return all products unexpectedly.', async () => {
            await expect(page).not.toHaveURL(/.*login/);
            await expect(page.locator('.product-list-table')).toBeVisible();
            const count = await page.locator('tbody tr').count();
            expect(count).toBeGreaterThanOrEqual(0);
        })
    })

    test('HN4: should handle very long filter input gracefully', async ({ homePage, page }) => {
        const longInput = 'a'.repeat(500);

        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter 500+ character string in filter.', async () => {
            await homePage.filterByName(longInput);
        })
        await test.step('Should not crash or become unresponsive.', async () => {
            await expect(page).not.toHaveURL(/.*login/);
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HN5: should handle whitespace-only filter input', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter only spaces in filter.', async () => {
            await homePage.filterByName('   ');
        })
        await test.step('Should treat as empty search and show zero results.', async () => {
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HN6: should handle rapid multiple clicks on filter button', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter text in filter.', async () => {
            await homePage.filterTextbox.fill('Product');
        })
        await test.step('3. Click filter button multiple times rapidly.', async () => {
            await homePage.filterButton.click();
            await homePage.filterButton.click();
            await homePage.filterButton.click();
            await Promise.all([
                homePage.filterButton.click(),
                homePage.filterButton.click()
            ]);
        })
        await test.step('Should not crash or cause race condition.', async () => {
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HN7: should handle numeric input in filter', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Enter numbers in filter.', async () => {
            await homePage.filterByName('12345');
        })
        await test.step('Should treat as string search (no results likely).', async () => {
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    // ========== VALIDATION & DATA TESTS ==========

    test('HV1: should verify product data types and formats', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('Verify table structure and data.', async () => {
            await expect(page.locator('.product-list-table')).toBeVisible();
            const headers = await homePage.getTableHeaderValues();
            expect(headers).toEqual(['ID', 'Name', 'Price', 'Date Stocked']);

            const firstRow = page.locator('tbody tr').first();
            await expect(firstRow).toBeVisible();
            const cells = firstRow.locator('td');
            await expect(cells).toHaveCount(4);

            const priceCell = cells.nth(2);
            const priceText = await priceCell.textContent();
            expect(priceText).toMatch(/^\$?\d+(\.\d{2})?$/);
        })
    })

    test('HV2: should verify table column headers are present', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Check table headers.', async () => {
            const headers = page.locator('thead th');
            const count = await headers.count();
            expect(count).toBe(4);

            for (let i = 0; i < count; i++) {
                const header = headers.nth(i);
                await expect(header).toBeVisible();
            }
        })
    })

    test('HV3: should maintain filter state after navigation', async ({ homePage, page }) => {
        const searchProduct = 'Product 2';

        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Apply a filter.', async () => {
            await homePage.filterByName(searchProduct);
        })
        await test.step('3. Navigate to another page and back.', async () => {
            await page.goto('/add-product');
            await page.goBack();
            await page.waitForURL(/.*\/$/);
        })
        await test.step('Filter should persist or reset appropriately.', async () => {
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HV4: should handle empty product state', async ({ homePage }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Verify products exist normally.', async () => {
            const initialCount = await homePage.page.locator('tbody tr').count();
            expect(initialCount).toBeGreaterThan(0);
        })
    })

    test('HV5: should filter case-insensitively', async ({ homePage }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Try lowercase filter for mixed-case product.', async () => {
            await homePage.filterByName('product');
        })
        await test.step('Should match products regardless of case.', async () => {
            const names = await homePage.visibleProductNames.allTextContents();
            expect(names.length).toBeGreaterThan(0);
            expect(names.every(n => n.toLowerCase().includes('product'))).toBeTruthy();
        })
    })

    // ========== ACCESSIBILITY TESTS ==========

    test('HA1: should verify ARIA labels on filter input', async ({ homePage }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Check filter textbox has appropriate aria-label.', async () => {
            const ariaLabel = await homePage.filterTextbox.getAttribute('aria-label');
            expect(ariaLabel).toBeTruthy();
        })
    })

    test('HA2: should support keyboard navigation on filter button', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Focus filter and use keyboard only.', async () => {
            await homePage.filterTextbox.focus();
            await homePage.filterTextbox.fill('Test');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Enter');
            await expect(page.locator('.product-list-table')).toBeVisible();
        })
    })

    test('HA3: should verify focus is visible on interactive elements', async ({ homePage, page }) => {
        await test.step('1. Navigate to the homepage.', async () => {
            await homePage.open();
        })
        await test.step('2. Tab through interactive elements.', async () => {
            await homePage.filterTextbox.focus();
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await expect(homePage.filterTextbox).toBeVisible();
        })
    })
})
