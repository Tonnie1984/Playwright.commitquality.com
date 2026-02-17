import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PracticeGeneralComponentsPage extends BasePage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly addProductLink: Locator;
  readonly practiceLink: Locator;
  readonly learnLink: Locator;
  readonly loginLink: Locator;
  readonly backToPracticeLink: Locator;

  // Buttons
  readonly clickMeButton: Locator;
  readonly doubleClickMeButton: Locator;
  readonly rightClickMeButton: Locator;

  // Radio buttons
  readonly radioButton1: Locator;
  readonly radioButton2: Locator;

  // Dropdown
  readonly selectAnOptionDropdown: Locator;

  // Checkboxes
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;
  readonly checkbox3: Locator;

  // Links
  readonly myYoutubeLink: Locator;
  readonly openMyYoutubeInNewTabLink: Locator;
  readonly goToPracticePageLink: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.addProductLink = page.getByRole('link', { name: 'Add Product' });
    this.practiceLink = page.getByRole('link', { name: 'Practice' }).first();
    this.learnLink = page.getByRole('link', { name: 'Learn' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.backToPracticeLink = page.getByRole('link', { name: 'back to practice' });

    // Buttons
    this.clickMeButton = page.getByTestId('basic-click');
    this.doubleClickMeButton = page.getByTestId('double-click');
    this.rightClickMeButton = page.getByTestId('right-click');

    // Radio buttons
    this.radioButton1 = page.getByLabel('Radio button', { exact: true });
    this.radioButton2 = page.getByLabel('Radio button 2');

    // Dropdown
    this.selectAnOptionDropdown = page.locator('#select-option');

    // Checkboxes
    this.checkbox1 = page.getByLabel('Checkbox 1');
    this.checkbox2 = page.getByLabel('Checkbox 2');
    this.checkbox3 = page.getByLabel('Checkbox 3');

    // Links
    this.myYoutubeLink = page.getByRole('link', { name: 'My Youtube' });
    this.openMyYoutubeInNewTabLink = page.getByRole('link', { name: 'Open my youtube in a new tab' });
    this.goToPracticePageLink = page.getByRole('link', { name: 'Go to practice page' });
  }

  async navigateTo() {
    await this.page.goto('https://commitquality.com/practice-general-components');
  }
}
