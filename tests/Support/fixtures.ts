import { test as base } from '@playwright/test';
import { BasePage } from '../Pages/BasePage';
import { HomePage } from '../Pages/HomePage';
import { AddProductPage } from '../Pages/AddProductPage';
import { PracticeGeneralComponentsPage } from '../Pages/PracticeGeneralComponentsPage';
import { LoginPage } from '../Pages/LoginPage';
type MyFixtures = {
    homePage: HomePage;
    basePage: BasePage;
    addProductPage: AddProductPage;
    practiceGeneralComponentsPage: PracticeGeneralComponentsPage;
    loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    addProductPage: async ({ page }, use) => {
        await use(new AddProductPage(page));
    },
    practiceGeneralComponentsPage: async ({ page }, use) => {
        await use(new PracticeGeneralComponentsPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
});

export { expect } from '@playwright/test';
export * from '@playwright/test';