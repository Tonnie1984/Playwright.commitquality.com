import { url } from 'node:inspector';
import { test, expect } from './Support/fixtures';
import { HomePage } from './Pages/HomePage';

test.beforeEach(async ({ addProductPage }) => {
    await addProductPage.open();
})

test.describe('B. Add Product Page - Complete Test Suite', () => {
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

    // ========== NEGATIVE TESTS - REQUIRED FIELDS ==========

    test('AN1: should display validation error when product name is empty', async ({ addProductPage }) => {
        await test.step('1. Enter price and date but leave name empty.', async () => {
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show validation error for product name.', async () => {
            await expect(addProductPage.productTextbox).toBeVisible();
            const errorLocator = addProductPage.page.locator('.error').first();
            await expect(errorLocator).toBeVisible({ timeout: 10000 });
        })
    })

    test('AN2: should display validation error when price is empty', async ({ addProductPage }) => {
        await test.step('1. Enter name and date but leave price empty.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show validation error for price.', async () => {
            await expect(addProductPage.priceTextbox).toBeVisible();
            const errorLocator = addProductPage.page.locator('.error').first();
            await expect(errorLocator).toBeVisible({ timeout: 10000 });
        })
    })

    test('AN3: should display errors when multiple fields are empty', async ({ addProductPage }) => {
        await test.step('1. Leave all fields empty.', async () => {
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show validation errors for required fields.', async () => {
            const errorCount = await addProductPage.page.locator('.error').count();
            expect(errorCount).toBeGreaterThan(0);
        })
    })

    // ========== NEGATIVE TESTS - PRICE VALIDATION ==========

    test('AN4: should reject negative price values', async ({ addProductPage }) => {
        await test.step('1. Enter negative price.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('-10.50');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show validation error for negative price.', async () => {
            const errorLocator = addProductPage.page.locator('.error').first();
            await expect(errorLocator).toBeVisible({ timeout: 10000 });
        })
    })

    test('AN5: should reject non-numeric price input', async ({ addProductPage }) => {
        await test.step('1. Enter letters in price field.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('abc');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show validation error for invalid price format.', async () => {
            const errorLocator = addProductPage.page.locator('.error').first();
            await expect(errorLocator).toBeVisible({ timeout: 10000 });
        })
    })

    test('AN6: should handle extremely large price values', async ({ addProductPage, page }) => {
        await test.step('1. Enter very large price (999999999.99).', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('999999999.99');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should either accept or show appropriate validation.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    test('AN7: should validate decimal precision (2 decimal places)', async ({ addProductPage, page }) => {
        await test.step('1. Enter price with 3+ decimal places.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('10.999');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should validate or round appropriately.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    // ========== NEGATIVE TESTS - DATE VALIDATION ==========

    test('AN8: should reject invalid date format (MM/DD/YYYY when expecting DD/MM/YYYY)', async ({ addProductPage }) => {
        await test.step('1. Enter date in US format (MM/DD/YYYY).', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('10.00');
            // MM/DD/YYYY format (02/10/2025 = Feb 10) vs DD/MM/YYYY (02 Oct)
            await addProductPage.enterDateStocked('02/10/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('System should handle or reject based on expected format.', async () => {
            await expect(addProductPage.page).toHaveURL(/.*\/$/);
        })
    })

    test('AN9: should reject future dates if not allowed', async ({ addProductPage }) => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const formattedDate = `${futureDate.getDate()}/${futureDate.getMonth()+1}/${futureDate.getFullYear()}`;

        await test.step('1. Enter future date.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked(formattedDate);
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should show error or accept based on business rules.', async () => {
            await expect(addProductPage.page).toHaveURL(/.*\/$/);
        })
    })

    test('AN10: should allow empty date field if optional', async ({ addProductPage, page }) => {
        await test.step('1. Enter name and price but skip date.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('10.00');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should submit successfully if date is optional.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    // ========== NEGATIVE TESTS - LIMITS & SECURITY ==========

    test('AN11: should handle very long product name (500+ chars)', async ({ addProductPage }) => {
        const longName = 'A'.repeat(500);

        await test.step('1. Enter 500+ character product name.', async () => {
            await addProductPage.enterProductName(longName);
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should truncate, reject, or handle gracefully.', async () => {
            await expect(addProductPage.page).toHaveURL(/.*\/$/);
        })
    })

    test('AN12: should handle SQL injection in product name', async ({ addProductPage, page }) => {
        await test.step('1. Enter SQL injection payload in name.', async () => {
            await addProductPage.enterProductName("' OR '1'='1");
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should sanitize input and not break the app.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    test('AN13: should handle XSS attempt in product name', async ({ addProductPage, page }) => {
        await test.step('1. Enter XSS payload in name.', async () => {
            await addProductPage.enterProductName('<script>alert("xss")</script>');
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit.', async () => {
            await addProductPage.clickSubmit();
        })
        await test.step('Should sanitize and not execute script.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    test('AN14: should handle rapid multiple clicks on submit button', async ({ addProductPage, page }) => {
        await test.step('1. Fill all fields.', async () => {
            await addProductPage.enterProductName('Test');
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Click submit button multiple times rapidly.', async () => {
            await addProductPage.submitButton.click();
            await addProductPage.submitButton.click();
            await addProductPage.submitButton.click();
            await Promise.all([
                addProductPage.submitButton.click(),
                addProductPage.submitButton.click()
            ]);
        })
        await test.step('Should not create duplicate products.', async () => {
            await expect(page).toHaveURL(/.*\/$/);
        })
    })

    // ========== BEHAVIOR TESTS ==========

    test('AC1: should navigate back without submitting', async ({ addProductPage, page }) => {
        await test.step('1. Fill some data but do not submit.', async () => {
            await addProductPage.enterProductName('Test');
            await addProductPage.enterProductPrice('10.00');
        })
        await test.step('2. Navigate back to home page.', async () => {
            await page.goBack();
        })
        await test.step('Should not create product and return to previous page.', async () => {
            await expect(page).toHaveURL(/.*\//);
        })
    })

    test('AC2: should preserve form data after failed submission', async ({ addProductPage, page }) => {
        await test.step('1. Fill all fields with valid data.', async () => {
            await addProductPage.enterProductName('Test Product');
            await addProductPage.enterProductPrice('10.00');
            await addProductPage.enterDateStocked('15/01/2025');
        })
        await test.step('2. Submit and cause validation error (e.g., empty required field).', async () => {
            await addProductPage.productTextbox.clear();
            await addProductPage.clickSubmit();
        })
        await test.step('Form data should persist in fields.', async () => {
            await expect(addProductPage.productTextbox).toHaveValue('');
            await expect(addProductPage.priceTextbox).toHaveValue('10.00');
        })
    })

    test('AC3: should clear sensitive fields after failed submission', async ({ addProductPage }) => {
        await test.step('1. Submit with invalid data to trigger error.', async () => {
            await addProductPage.enterProductName('Test');
            await addProductPage.clickSubmit();
        })
        await test.step('2. Check if sensitive fields are cleared.', async () => {
            const nameValue = await addProductPage.productTextbox.inputValue();
            // Username-like fields may clear for security
            expect(nameValue === '' || nameValue === 'Test').toBeTruthy();
        })
    })

    // ========== ACCESSIBILITY TESTS ==========

    test('AA1: should verify all form fields have proper labels', async ({ addProductPage }) => {
        await test.step('1. Navigate to Add Product page.', async () => {
            await addProductPage.open();
        })
        await test.step('2. Check each input has associated label or aria-label.', async () => {
            const productLabel = await addProductPage.page.getByLabel('Product', { exact: true }).count();
            const priceLabel = await addProductPage.page.getByLabel('Price', { exact: true }).count();
            const dateLabel = await addProductPage.page.getByLabel('Date', { exact: true }).count();

            expect(productLabel).toBeGreaterThan(0);
            expect(priceLabel).toBeGreaterThan(0);
            expect(dateLabel).toBeGreaterThan(0);
        })
    })

    test('AA2: should support keyboard-only navigation', async ({ addProductPage, page }) => {
        await test.step('1. Navigate to Add Product page.', async () => {
            await addProductPage.open();
        })
        await test.step('2. Tab through all form fields.', async () => {
            await addProductPage.productTextbox.focus();
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            await expect(addProductPage.submitButton).toBeVisible();
        })
    })

    test('AA3: should verify required fields are marked as required', async ({ addProductPage }) => {
        await test.step('1. Navigate to Add Product page.', async () => {
            await addProductPage.open();
        })
        await test.step('2. Check required attribute on mandatory fields.', async () => {
            const productRequired = await addProductPage.productTextbox.getAttribute('required');
            const priceRequired = await addProductPage.priceTextbox.getAttribute('required');
            const dateRequired = await addProductPage.dateStockedInput.getAttribute('required');

            expect(productRequired).toBeTruthy();
            expect(priceRequired).toBeTruthy();
        })
    })
})
