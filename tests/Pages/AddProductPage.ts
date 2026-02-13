import { type Locator, Page } from "@playwright/test"
import { BasePage } from "./BasePage";


export class AddProductPage extends BasePage {

    readonly productTextbox: Locator;
    readonly priceTextbox: Locator;
    readonly dateStockedInput: Locator;
    readonly submitButton: Locator;
    readonly showMoreButton: Locator;
    readonly addProductHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.productTextbox = page.getByTestId('product-textbox');
        this.priceTextbox = page.getByTestId('price-textbox');
        this.dateStockedInput = page.getByTestId('date-stocked')
        this.submitButton = page.getByTestId('submit-form')
        this.showMoreButton = page.getByTestId('show-more-button');
        this.addProductHeading = page.getByRole('heading', { name: 'Add Product' });
    }

    async open() {
        await this.page.goto("/add-product");
        await this.addProductHeading.waitFor({ state: 'visible' });
    }

    async enterProductName(productName: string) {
        await this.productTextbox.fill(productName)
    }

    async enterProductPrice(productPrice: string) {
        await this.priceTextbox.fill(productPrice)
    }

    async enterDateStocked(dateStocked: string) {
        let finalDate = dateStocked;

        if (dateStocked.includes('/')) {
            const [day, month, year] = dateStocked.split('/');
            // Importante: Usar ` ` y no ' '
            finalDate = `${year}-${month}-${day}`;
        }

        await this.dateStockedInput.fill(finalDate);
    }

    async clickSubmit() {
        await this.submitButton.click();
    }
}