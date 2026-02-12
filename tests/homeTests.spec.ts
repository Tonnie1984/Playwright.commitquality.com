import { test, expect } from './Support/fixtures';
import { HomePage } from './Pages/HomePage';


test.describe('A. Home Page (Product List) tests', () => {
    test('Verify Product Table Loading', async ({ page, homePage }) => {
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

    test('Filter Functionality', async ({ homePage }) => {
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

    test('Reset Button', async ({ homePage }) => {
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

    test('Show More (Pagination)', async ({ homePage, page }) => {
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
    



})

