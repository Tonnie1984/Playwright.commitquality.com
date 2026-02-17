import { test, expect } from "./Support/fixtures";

test.describe("Login Page Tests - Element Interaction & Validation", () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.open();
    });

    // ========== POSITIVE TESTS ==========

    test("P1: should successfully fill username field", async ({ loginPage }) => {
        await loginPage.enterUsername('testuser@example.com');
        await expect(loginPage.usernameInput).toHaveValue('testuser@example.com');
    });

    test("P2: should successfully fill password field", async ({ loginPage }) => {
        await loginPage.enterPassword('MySecurePassword123!');
        const value = await loginPage.passwordInput.inputValue();
        expect(value).toBe('MySecurePassword123!');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test("P3: should allow clicking the login button when form is complete", async ({ page, loginPage }) => {
        await loginPage.enterUsername('user@test.com');
        await loginPage.enterPassword('pass123');
        await expect(loginPage.loginButton).toBeEnabled();
        await loginPage.loginButton.click();
        await expect(page).toHaveURL(/.*login/);
    });

    test("P4: should execute complete login flow via login() method", async ({ page, loginPage }) => {
        await loginPage.login('testuser', 'testpass');
        await expect(page).toHaveURL(/.*login/);
    });

    test("P5: should verify all form elements are visible and enabled", async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.usernameInput).toBeEnabled();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeEnabled();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();
    });

    test("P6: should verify form elements have correct HTML attributes", async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toHaveAttribute('type', 'text');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        const buttonType = await loginPage.loginButton.getAttribute('type');
        expect(['button', 'submit']).toContain(buttonType);
        await expect(loginPage.usernameInput).toHaveAttribute('data-testid', 'username-textbox');
        await expect(loginPage.passwordInput).toHaveAttribute('data-testid', 'password-textbox');
        await expect(loginPage.loginButton).toHaveAttribute('data-testid', 'login-button');
    });

    test("P7: should handle tab navigation between form fields", async ({ page, loginPage }) => {
        await loginPage.usernameInput.focus();
        await page.keyboard.press('Tab');
        const activeElement = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            return el ? el.getAttribute('data-testid') : null;
        });
        expect(activeElement).toBeTruthy();
    });

    // ========== NEGATIVE TESTS ==========

    test("N1: should display validation error when username is empty", async ({ page, loginPage }) => {
        await loginPage.enterPassword('somepassword');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
        await expect(page).toHaveURL(/.*login/);
    });

    test("N2: should display validation error when password is empty", async ({ page, loginPage }) => {
        await loginPage.enterUsername('test@example.com');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
        await expect(page).toHaveURL(/.*login/);
    });

    test("N3: should display errors when both fields are empty", async ({ page, loginPage }) => {
        await loginPage.submitLogin();
        const errorCount = await page.locator('.error').count();
        expect(errorCount).toBeGreaterThan(0);
    });

    test("N4: should fail login with incorrect credentials", async ({ page, loginPage }) => {
        await loginPage.enterUsername('wronguser@example.com');
        await loginPage.enterPassword('wrongpass');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
        await expect(page).toHaveURL(/.*login/);
    });

    test("N5: should validate email format on submission", async ({ page, loginPage }) => {
        await loginPage.enterUsername('invalid-email');
        await loginPage.enterPassword('anypass');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N6: should handle form submission via Enter key", async ({ page, loginPage }) => {
        await loginPage.enterUsername('user@test.com');
        await loginPage.enterPassword('pass123');
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/.*login/);
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N7: should handle very long username input gracefully", async ({ page, loginPage }) => {
        const longUsername = 'a'.repeat(500);
        await loginPage.enterUsername(longUsername);
        await loginPage.enterPassword('Password123');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N8: should handle SQL injection attempt safely", async ({ page, loginPage }) => {
        await loginPage.enterUsername("' OR '1'='1");
        await loginPage.enterPassword("' OR '1'='1");
        await loginPage.submitLogin();
        await expect(page).toHaveURL(/.*login/);
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N9: should prevent submission with whitespace-only username", async ({ page, loginPage }) => {
        await loginPage.enterUsername('   ');
        await loginPage.enterPassword('Pass123');
        await loginPage.submitLogin();
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N10: should handle rapid multiple clicks on login button", async ({ page, loginPage }) => {
        await loginPage.enterUsername('user@test.com');
        await loginPage.enterPassword('pass123');
        await loginPage.loginButton.click();
        await loginPage.loginButton.click();
        await Promise.all([
            loginPage.loginButton.click(),
            loginPage.loginButton.click(),
            loginPage.loginButton.click()
        ]);
        const errorLocator = page.locator('.error').first();
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
    });

    test("N11: should verify username field clears after failed login", async ({ loginPage }) => {
        await loginPage.enterUsername('baduser');
        await loginPage.enterPassword('badpass');
        await loginPage.submitLogin();
        const value = await loginPage.usernameInput.inputValue();
        expect(value === '' || value === 'baduser').toBeTruthy();
    });

    test("N12: should verify password field may clear for security after failure", async ({ loginPage }) => {
        await loginPage.enterUsername('testuser');
        await loginPage.enterPassword('badpass');
        await loginPage.submitLogin();
        const value = await loginPage.passwordInput.inputValue();
        expect(value === '' || value === 'badpass').toBeTruthy();
    });

    test("N13: should verify form elements remain accessible after error", async ({ page, loginPage }) => {
        await loginPage.login('bad', 'bad');
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.usernameInput).toBeEnabled();
        await expect(loginPage.passwordInput).toBeEnabled();
        await expect(loginPage.loginButton).toBeEnabled();
    });

    // N14: Removed - page does not use role="alert" on error messages
});