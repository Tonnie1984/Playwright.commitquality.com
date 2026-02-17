import { test, expect } from "./Support/fixtures";

test.describe("Practice General Components Page Tests", () => {
    test.beforeEach(async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.navigateTo();
    });

    test("should click on 'Click me' button and verify success message", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.clickMeButton.click();
        await expect(page.getByText('You clicked the button!')).toBeVisible();
    });

    test("should double click on 'Double click me' button and verify success message", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.doubleClickMeButton.dblclick();
        await expect(page.getByText('You double clicked the button!')).toBeVisible();
    });

    test("should right click on 'Right click me' button and verify success message", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.rightClickMeButton.click({
            button: "right"
        });
        await expect(page.getByText('You right-clicked the button!')).toBeVisible();
    });

    test("should select Radio button 1", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.radioButton1.click();
        await expect(practiceGeneralComponentsPage.radioButton1).toBeChecked();
        await expect(practiceGeneralComponentsPage.radioButton2).not.toBeChecked();
    });

    test("should select Radio button 2", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.radioButton2.click();
        await expect(practiceGeneralComponentsPage.radioButton2).toBeChecked();
        await expect(practiceGeneralComponentsPage.radioButton1).not.toBeChecked();
    });

    test("should select an option from the dropdown", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.selectAnOptionDropdown.selectOption("Option 1");
        await expect(practiceGeneralComponentsPage.selectAnOptionDropdown).toHaveValue("option1");
    });

    test("should check Checkbox 1", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.checkbox1.check();
        await expect(practiceGeneralComponentsPage.checkbox1).toBeChecked();
    });

    test("should uncheck Checkbox 1", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.checkbox1.check(); // First check it
        await expect(practiceGeneralComponentsPage.checkbox1).toBeChecked();
        await practiceGeneralComponentsPage.checkbox1.uncheck();
        await expect(practiceGeneralComponentsPage.checkbox1).not.toBeChecked();
    });

    test("should check all checkboxes", async ({ practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.checkbox1.check();
        await practiceGeneralComponentsPage.checkbox2.check();
        await practiceGeneralComponentsPage.checkbox3.check();
        await expect(practiceGeneralComponentsPage.checkbox1).toBeChecked();
        await expect(practiceGeneralComponentsPage.checkbox2).toBeChecked();
        await expect(practiceGeneralComponentsPage.checkbox3).toBeChecked();
    });

    test("should navigate to My Youtube link", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.myYoutubeLink.click();
        await page.waitForLoadState("domcontentloaded");
        expect(page.url()).toContain("youtube.com");
        await page.screenshot({ path: "tests/screenshots/my-youtube-link.png" });
    });

    test("should navigate to Go to practice page link", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.goToPracticePageLink.click();
        await page.waitForLoadState("domcontentloaded");
        expect(page.url()).toContain("commitquality.com/practice");
        await page.screenshot({ path: "tests/screenshots/go-to-practice-page-link.png" });
    });

    test("should verify 'Open my youtube in a new tab' link opens in new tab", async ({ page, practiceGeneralComponentsPage, context }) => {
        const [newPage] = await Promise.all([
            context.waitForEvent("page"),
            practiceGeneralComponentsPage.openMyYoutubeInNewTabLink.click(),
        ]);
        await newPage.waitForLoadState("domcontentloaded");
        expect(newPage.url()).toContain("youtube.com");
        await newPage.screenshot({ path: "tests/screenshots/open-my-youtube-in-new-tab-link.png" });
        await newPage.close();
    });

    // Negative Tests

    test("should not be able to click on a disabled button (example - conceptual)", async ({ page }) => {
        // This is a conceptual test as there are no disabled buttons on the page.
        // If there were a disabled button with locator #disabledButton,
        // the test would look like this:
        // await expect(page.locator("#disabledButton")).toBeDisabled();
    });

    test("should not select a non-existent option from the dropdown", async ({ practiceGeneralComponentsPage }) => {
        // Playwright will throw an error if the option does not exist, this is more of an error handling test.
        // We expect the operation to fail if the option is not found.
        await expect(practiceGeneralComponentsPage.selectAnOptionDropdown.selectOption("NonExistentOption")).rejects.toThrow();
    });

    test("should not be able to uncheck an already unchecked checkbox (conceptual)", async ({ practiceGeneralComponentsPage }) => {
        // This is a conceptual test. Assuming checkbox1 is unchecked by default.
        await expect(practiceGeneralComponentsPage.checkbox1).not.toBeChecked();
        // Attempting to uncheck an already unchecked checkbox should not change its state.
        await practiceGeneralComponentsPage.checkbox1.uncheck();
        await expect(practiceGeneralComponentsPage.checkbox1).not.toBeChecked();
    });

    test("should FAIL to navigate to youtube when clicking 'Go to practice page' link (Negative Test)", async ({ page, practiceGeneralComponentsPage }) => {
        await practiceGeneralComponentsPage.goToPracticePageLink.click();
        await page.waitForLoadState("domcontentloaded");
        expect(page.url()).not.toContain("youtube.com"); // Negative assertion
    });
});
