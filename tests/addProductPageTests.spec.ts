import { url } from 'node:inspector';
import { test, expect } from './Support/fixtures';
import { HomePage } from './Pages/HomePage';

test.beforeEach(async ({ addProductPage }) => {
    await addProductPage.open();
})

test.describe('B. Add Product Page', () => {
    const newProduct = 'Apple';
    const newPrice = '10.50';
    const appleStockDate = '10/02/2025';

    test('Create Product (Happy Path)', async ({ addProductPage, homePage, page }) => {
        await test.step('1. Enter a valid "Name".', async () => {
            await addProductPage.enterProductName(newProduct);
        })
        await test.step('2. Enter a numeric "Price".', async () => {
            await addProductPage.enterProductPrice(newPrice);
        })
        await test.step('3. Select a "Date Stocked".', async () => {
            await addProductPage.enterDateStocked(appleStockDate);
        })
        await test.step('4. Click "Submit".', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('the new product should appear on the Home Page list', async () => {
            await expect(page).toHaveURL('/');
            await expect(page.locator("tbody tr:nth-child(1) td:nth-child(2)")).toContainText(newProduct);
        })


    })

})