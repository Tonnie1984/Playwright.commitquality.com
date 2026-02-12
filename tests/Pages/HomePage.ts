import {type Locator,  Page } from "@playwright/test"
import { BasePage } from "./BasePage";


export class HomePage extends BasePage {
    readonly filterTextbox: Locator;
    readonly filterButton: Locator;
    readonly resetFilterButton: Locator;
    readonly addProductButton: Locator;
    readonly showMoreButton: Locator;
    
    constructor(page: Page){
        super(page);
        this.filterTextbox = page.getByRole('textbox', { name: 'Filter by product name' });
        this.filterButton = page.getByTestId('filter-button');
        this.resetFilterButton = page.getByTestId('reset-filter-button');
        this.addProductButton = page.getByTestId('add-a-product-button');
        this.showMoreButton = page.getByTestId('show-more-button');
    }

    async open() {
        await this.page.goto("/");
        await this.filterTextbox.waitFor({ state: 'visible' });
    }

    async filterByName(productName: string) {
        await this.filterTextbox.fill(productName);
        await this.filterButton.click();
        await this.visibleProductNames.first().waitFor({ state: 'visible' });
    }

    async resetFilters() {
        await this.resetFilterButton.click();
    }

    async clickAddProduct() {
        await this.addProductButton.click();
    }

    async clickShowMore() {
        await this.showMoreButton.click();
    }

    async getTableHeaderValues(): Promise<string[]> {
        const headers = this.page.locator('thead th');
        return await headers.allTextContents();
    }

    get visibleProductNames() {
        return this.page.locator('tbody tr td:nth-child(2)');
    }
}