import { type Locator, Page } from "@playwright/test"
import { BasePage } from "./BasePage";


export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByTestId('username-textbox');
        this.passwordInput = page.getByTestId('password-textbox');
        this.loginButton = page.getByTestId('login-button');
    }

    async open() {
        await this.page.goto("/login");
        await this.usernameInput.waitFor({ state: 'visible' });
    }

    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async submitLogin() {
        await this.loginButton.click();
    }

    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.submitLogin();
    }

    // Método para verificar error visible
    async getErrorMessages() {
        return this.page.locator('[role="alert"], .error, .alert, .text-error').all();
    }
}