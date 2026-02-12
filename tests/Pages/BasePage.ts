import {type Locator,  Page , expect} from "@playwright/test"


export class BasePage {
    readonly page: Page ;
    readonly productsNavbar: Locator;
    readonly addProductNavbar: Locator;
    readonly practiceNavbar: Locator;
    readonly learnNavbar: Locator;
    readonly loginNavbar: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.productsNavbar = page.getByTestId('navbar-products');
        this.addProductNavbar = page.getByTestId('navbar-addproduct');
        this.practiceNavbar = page.getByTestId('navbar-practice');
        this.learnNavbar = page.getByTestId('navbar-learn');
        this.loginNavbar = page.getByTestId('navbar-login');
    }

    async open(path: string = "/") {
        await this.page.goto(path);
    }

    async clickProducts() {
        await this.productsNavbar.click();
        await expect(this.page).toHaveURL(/\/$/); 
    }

    async clickAddProduct() {
        await this.addProductNavbar.click();
        await expect(this.page).toHaveURL(/.*add-product/);
    }

    async clickPractice() {
        await this.practiceNavbar.click();
        await expect(this.page).toHaveURL(/.*practice/);
    }

    async clickLogin() {
        await this.loginNavbar.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async verifyPageTitle(title: string | RegExp) {
        await expect(this.page).toHaveTitle(title);
    }
}