# Playwright.commitquality.com
To validate the functional integrity of the CommitQuality demo application

Here is the comprehensive **Test Plan** for **CommitQuality.com** and its sub-pages, written in English.

Since this website is designed as a sandbox for QA engineers, this plan focuses on both standard functionality (CRUD) and the specific technical challenges (Iframes, Popups) located in the "Practice" section.

---

# Master Test Plan: CommitQuality.com

## 1. Introduction

**Objective:** To validate the functional integrity of the CommitQuality demo application, ensuring that product management features work as expected and that the "Practice" components interact correctly with automation scripts.
**Scope:**

* **Home Page:** Product listing, filtering, and resetting.
* **Add Product:** Form submission and validation.
* **Practice Page:** Advanced UI components (Iframes, Popups, etc.).
* **Login:** Authentication flows.

## 2. Test Environment

* **URL:** `https://commitquality.com/`
* **Supported Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge.
* **Recommended Automation Tools:** Playwright.

---

## 3. Detailed Test Scenarios

### A. Home Page (Product List)

**URL:** `https://commitquality.com/`

| Test Case ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| **TC-HOME-01** | **Verify Product Table Loading** | 1. Navigate to the homepage.<br> 2.Check for the visibility of the product table. | The table should load with columns: ID, Name, Price, and Date Stocked. Data rows should be visible. |
| **TC-HOME-02** | **Filter Functionality** | 1. Enter a known product name (e.g., "Product 1") in the "Filter" input.<br> 2. Click "Filter" or press Enter. | The table should update to show **only** rows matching the search criteria. |
| **TC-HOME-03** | **Reset Button** | 1. Apply a filter.<br>2. Click the "Reset" button. | The filter input should clear, and the table should reload to show **all** products. |
| **TC-HOME-04** | **Show More (Pagination)** | 1. Scroll to the bottom of the list.<br>2. Click "Show More". | Additional products (if available in the mock DB) should append to the bottom of the table without a full page refresh. |
| **TC-HOME-05** | **Verify "Add Product" CTA** | 1. Click the "Add Product" button/link. | User should be redirected to `/add-product`. |

### B. Add Product Page

**URL:** `https://commitquality.com/add-product`

| Test Case ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| **TC-ADD-01** | **Create Product (Happy Path)** | 1. Enter a valid "Name".<br>2. Enter a numeric "Price".<br>3. Select a "Date Stocked".<br>4. Click "Submit". | The system should acknowledge the submission, and the new product should appear on the Home Page list (verify via ID). |
| **TC-ADD-02** | **Empty Field Validation** | 1. Leave "Name" empty.<br>2. Click "Submit". | The system should block submission and display a validation error (e.g., "Field required"). |
| **TC-ADD-03** | **Price Field Validation** | 1. Enter text (e.g., "Twenty") in the "Price" field.<br>2. Click "Submit". | The field should either reject the input type or show an error message upon submission. |
| **TC-ADD-04** | **Cancel Operation** | 1. Fill in fields.<br>2. Click "Cancel". | The form should clear, or the user should be redirected to the Home Page without saving. |

### C. Practice Page (Automation Challenges)

**URL:** `https://commitquality.com/practice`
*This section specifically targets elements that are difficult to automate.*

| Test Case ID | Component | Test Action | Expected Result |
| --- | --- | --- | --- |
| **TC-PRAC-01** | **Radio Buttons & Checkboxes** | Select a specific radio option and check a box. | The state of the element must change to `checked: true`. |
| **TC-PRAC-02** | **Dropdowns** | Select "Option 2" from the dropdown menu. | The value of the select element should update to the chosen option. |
| **TC-PRAC-03** | **Accordions** | Click on an accordion header. | The hidden text panel should expand and become visible (check `visibility` or `display` property). |
| **TC-PRAC-04** | **Popups** | Click the trigger button for a popup. | A modal/alert should appear. Automation script must be able to handle/dismiss the alert. |
| **TC-PRAC-05** | **Iframes** | Locate the Iframe and click a button inside it. | The test script must successfully switch context (`switch_to_frame`) to interact with inner elements. |
| **TC-PRAC-06** | **File Upload** | Upload a dummy `.txt` or `.png` file. | The UI should display a success message or the name of the uploaded file. |
| **TC-PRAC-07** | **Dynamic Text** | Refresh the page and capture the dynamic text. | Confirm that the text changes or is present in the DOM (verifies dynamic locator strategies). |

### D. Login Page

**URL:** `https://commitquality.com/login` (or accessed via menu)

| Test Case ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| **TC-LOG-01** | **Invalid Login** | 1. Enter "test" / "test" <br> Click "Login". | Error message: "Invalid username or password" (or similar). |
| **TC-LOG-02** | **Valid Login** | 1. Enter valid credentials (usually `admin` / `admin` for demo sites, or check `/learn` for hints). | Successful redirection to a dashboard or a change in the header (e.g., "Logout" button appears). |

---

## 4. Automation Strategy Suggestion

Since this is a React-based single-page application (SPA), I recommend using  **Playwright** for the following reasons:

1. **Speed:** They handle dynamic content (like the "Show More" feature) better than Selenium.
2. **Selectors:** They have excellent tools for finding elements even when IDs are dynamic (crucial for the "Practice" page).
3. **Network Stubbing:** You can easily mock the backend responses to test the UI without actually creating thousands of products.

