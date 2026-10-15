import { test, expect, type Page } from '@playwright/test';

async function login(page: Page, username = 'standard_user', password = 'secret_sauce') {
  await page.goto('https://www.saucedemo.com');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

async function addProduct(page: Page, productId: string) {
  await page.locator(`[data-test="add-to-cart-${productId}"]`).click();
}

test.describe('Saucedemo end-user flows', () => {
  test('1. Log in to the storefront', async ({ page }) => {
    // Open the Saucedemo login page at https://www.saucedemo.com.
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.getByRole('form', { name: /login/i })).toBeVisible();

    // Enter a valid username such as standard_user and the password secret_sauce.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click the Login button.
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');

    // Repeat the process using an invalid login combination.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(/locked out|user has been locked out/i);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('2. Browse and sort products', async ({ page }) => {
    // Start from the inventory page in a fresh session.
    await login(page);
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Select Name (A to Z) from the sort dropdown.
    await page.locator('[data-test="product-sort-container"]').selectOption('az');
    const namesAz = await page.locator('.inventory_item_name').allTextContents();
    expect([...namesAz].sort()).toEqual(namesAz);

    // Change the sort to Price (low to high) and then Price (high to low).
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const pricesLowToHigh = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = pricesLowToHigh.map((price) => Number(price.replace('$', '')));
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));

    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const pricesHighToLow = await page.locator('.inventory_item_price').allTextContents();
    const numericHighToLow = pricesHighToLow.map((price) => Number(price.replace('$', '')));
    expect(numericHighToLow).toEqual([...numericHighToLow].sort((a, b) => b - a));

    // Open a product detail view if the product link is available.
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/.*inventory-item\.html.*/);
    await expect(page.getByRole('button', { name: /back to products/i })).toBeVisible();
    await page.getByRole('button', { name: /back to products/i }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('3. Add products to the cart', async ({ page }) => {
    // Add one product from the catalog to the cart.
    await login(page);
    await addProduct(page, 'sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Add a second product from the catalog.
    await addProduct(page, 'sauce-labs-bike-light');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Open the cart from the header icon.
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.inventory_item_name')).toHaveCount(2);

    // Remove one item from the cart.
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('4. Review cart and enter checkout information', async ({ page }) => {
    // On the cart page, confirm the product summary and total amount.
    await login(page);
    await addProduct(page, 'sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText(/Sauce Labs Backpack/i);

    // Click the Checkout button.
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Enter valid first name, last name, and postal code.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // Leave one required field blank and attempt to continue.
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await page.locator('[data-test="firstName"]').fill('');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(/first name/i);
  });

  test('5. Complete the purchase', async ({ page }) => {
    // Review the order details on the checkout overview page.
    await login(page);
    await addProduct(page, 'sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('.summary_info')).toBeVisible();

    // Click Finish to submit the order.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // Verify the completion state and the available navigation options.
    await expect(page.locator('.complete-header')).toHaveText(/thank you for your order!/i);
    await expect(page.getByRole('button', { name: /back home/i })).toBeVisible();
  });
});
