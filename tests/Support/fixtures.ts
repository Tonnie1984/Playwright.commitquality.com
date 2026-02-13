import { test as base } from '@playwright/test';
import { BasePage } from '../Pages/BasePage';
import { HomePage } from '../Pages/HomePage';
import { AddProductPage } from '../Pages/addProductPage';

type MyFixtures = {
    homePage: HomePage;
    basePage: BasePage;
    addProductPage: AddProductPage;

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
});

export { expect } from '@playwright/test';
export * from '@playwright/test';