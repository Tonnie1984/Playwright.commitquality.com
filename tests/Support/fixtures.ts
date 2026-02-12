import { test as base } from '@playwright/test';
import { BasePage } from '../Pages/BasePage';
import { HomePage } from '../Pages/HomePage';

type MyFixtures = {
    homePage: HomePage;
    basePage: BasePage;
    
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        
        await use(new HomePage(page));
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
});

export { expect } from '@playwright/test';
export * from '@playwright/test';