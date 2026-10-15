# Saucedemo End-User Test Plan

## Application Overview

Saucedemo is a demo e-commerce storefront. This plan covers the five core operations a typical end user performs: logging in, browsing products, adding products to the cart, checking out, and completing the purchase. The tests assume a fresh browser session and a standard user flow.

## Test Scenarios

### 1. Saucedemo end-user flows

**Seed:** `tests/seed.spec.ts`

#### 1.1. 1. Log in to the storefront

**File:** `specs/saucedemo-test-plan.md`

**Steps:**
  1. Open the Saucedemo login page at https://www.saucedemo.com.
    - expect: The page shows the Swag Labs login form and the username/password guidance.
  2. Enter a valid username such as standard_user and the password secret_sauce.
    - expect: The credentials are accepted and no validation error is displayed.
  3. Click the Login button.
    - expect: The user is redirected to the inventory page and sees a product listing.
  4. Repeat the process using an invalid login combination.
    - expect: The site displays an error message and prevents access to the inventory page.

#### 1.2. 2. Browse and sort products

**File:** `specs/saucedemo-test-plan.md`

**Steps:**
  1. Start from the inventory page in a fresh session.
    - expect: Multiple product cards are visible with an image, item name, price, and Add to cart button.
  2. Select Name (A to Z) from the sort dropdown.
    - expect: The list order updates alphabetically and remains visually consistent.
  3. Change the sort to Price (low to high) and then Price (high to low).
    - expect: The product ordering reflects the selected pricing sort without duplicate items or layout issues.
  4. Open a product detail view if the product link is available.
    - expect: The selected item detail is visible and the user can return to the catalog without losing the browsing state.

#### 1.3. 3. Add products to the cart

**File:** `specs/saucedemo-test-plan.md`

**Steps:**
  1. Add one product from the catalog to the cart.
    - expect: The cart badge count increases, and the button text changes to reflect the item has been added.
  2. Add a second product from the catalog.
    - expect: The cart badge count reflects both items, and the cart icon remains visible and clickable.
  3. Open the cart from the header icon.
    - expect: The cart page lists the selected products with the correct item names and prices.
  4. Remove one item from the cart.
    - expect: The removed item disappears from the cart and the count decreases accordingly.

#### 1.4. 4. Review cart and enter checkout information

**File:** `specs/saucedemo-test-plan.md`

**Steps:**
  1. On the cart page, confirm the product summary and total amount.
    - expect: The cart contains the expected items and the user can continue to the checkout flow.
  2. Click the Checkout button.
    - expect: The user reaches the checkout information form.
  3. Enter valid first name, last name, and postal code.
    - expect: The form accepts the information and allows the user to continue to the review step.
  4. Leave one required field blank and attempt to continue.
    - expect: The application shows validation feedback and blocks the user from moving forward until the field is corrected.

#### 1.5. 5. Complete the purchase

**File:** `specs/saucedemo-test-plan.md`

**Steps:**
  1. Review the order details on the checkout overview page.
    - expect: The final product list and totals match the items already chosen in the cart.
  2. Click Finish to submit the order.
    - expect: The user sees a confirmation page with a success message such as Thank you for your order!
  3. Verify the completion state and the available navigation options.
    - expect: The page clearly communicates a successful purchase and offers a path back to the products catalog or a new shopping session.
