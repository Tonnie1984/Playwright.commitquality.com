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

    test('Filter Functionality', async ({ page, homePage }) => {
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
    
})
    
