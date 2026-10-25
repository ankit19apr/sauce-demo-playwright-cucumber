import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

Given('I open the SauceDemo login page', async function (this: CustomWorld) {
  await this.uiPage.goto('/');
});

When('I log in as {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
  await new LoginPage(this.uiPage).login(username, password);
});

Then('I should be on the inventory page', async function (this: CustomWorld) {
  await expect(this.uiPage).toHaveURL(/inventory/);
});

Then('I should see the login error {string}', async function (this: CustomWorld, message: string) {
  await expect(this.uiPage.getByText(message, { exact: true })).toBeVisible();
});

Given('I am on the inventory page', async function (this: CustomWorld) {
  await this.uiPage.goto('/inventory.html');
});

Then('I should see {int} products', async function (this: CustomWorld, count: number) {
  await expect(new InventoryPage(this.uiPage).productCards).toHaveCount(count);
});

When('I open the {string} product', async function (this: CustomWorld, productName: string) {
  const inventory = new InventoryPage(this.uiPage);
  await inventory.productCards.filter({ hasText: productName }).getByText(productName, { exact: true }).click();
});

Then('I should see product details for {string}', async function (this: CustomWorld, productName: string) {
  const details = new ProductDetailsPage(this.uiPage);
  await expect(details.productName).toHaveText(productName);
  if (productName === 'Sauce Labs Backpack') {
    await expect(details.productDescription).toHaveText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
  }
});

Then('the product price should be {string}', async function (this: CustomWorld, price: string) {
  await expect(new ProductDetailsPage(this.uiPage).productPrice).toHaveText(price);
});

Then('the add to cart button should be visible', async function (this: CustomWorld) {
  await expect(new ProductDetailsPage(this.uiPage).addToCartButton).toBeVisible();
});

Then('the back to products button should be visible', async function (this: CustomWorld) {
  await expect(new ProductDetailsPage(this.uiPage).backToProductsButton).toBeVisible();
});

Then('the product image should be visible', async function (this: CustomWorld) {
  await expect(new ProductDetailsPage(this.uiPage).productImage).toBeVisible();
});

When('I sort products by {string}', async function (this: CustomWorld, sortOption: string) {
  await new InventoryPage(this.uiPage).sortDropdown.selectOption(sortOption);
});

Then('products should be sorted by {string}', async function (this: CustomWorld, sorting: string) {
  const inventory = new InventoryPage(this.uiPage);
  if (sorting.startsWith('name')) {
    const actual = await inventory.productNames.allTextContents();
    const expected = [...actual].sort((a, b) => a.localeCompare(b));
    if (sorting === 'name descending') expected.reverse();
    expect(actual).toEqual(expected);
  } else {
    const raw = await inventory.productCards.locator('.inventory_item_price').allTextContents();
    const actual = raw.map(value => Number(value.replace('$', '')));
    const expected = [...actual].sort((a, b) => a - b);
    if (sorting === 'price descending') expected.reverse();
    expect(actual).toEqual(expected);
  }
});

When('I add {string} to the cart', async function (this: CustomWorld, productName: string) {
  const card = new InventoryPage(this.uiPage).productCards.filter({ hasText: productName });
  await card.getByRole('button', { name: 'Add to cart' }).click();
});

Then('the cart badge should show {string}', async function (this: CustomWorld, count: string) {
  await expect(new CartPage(this.uiPage).cartBadge).toHaveText(count);
});

When('I open the shopping cart', async function (this: CustomWorld) {
  await new CartPage(this.uiPage).shoppingCartLink.click();
  await expect(this.uiPage).toHaveURL(/cart.html/);
});

Then('the cart should contain {string} priced {string}', async function (this: CustomWorld, productName: string, price: string) {
  const item = this.uiPage.locator('.cart_item').filter({ hasText: productName });
  await expect(item).toBeVisible();
  await expect(item.locator('.inventory_item_price')).toHaveText(price);
  await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
});

When('I proceed to checkout', async function (this: CustomWorld) {
  await new CartPage(this.uiPage).checkoutButton.click();
});

Then('I should be on the checkout information page', async function (this: CustomWorld) {
  await expect(this.uiPage).toHaveURL(/checkout-step-one.html/);
  await expect(new CheckoutPage(this.uiPage).informationLabel).toBeVisible();
});

When('I remove {string} from the inventory', async function (this: CustomWorld, productName: string) {
  const card = new InventoryPage(this.uiPage).productCards.filter({ hasText: productName });
  await card.getByRole('button', { name: 'Remove' }).click();
});

When('I remove {string} from the cart', async function (this: CustomWorld, productName: string) {
  const item = this.uiPage.locator('.cart_item').filter({ hasText: productName });
  await item.getByRole('button', { name: 'Remove' }).click();
});

Then('the cart should be empty', async function (this: CustomWorld) {
  await expect(this.uiPage.locator('.shopping_cart_badge')).toHaveCount(0);
  await expect(this.uiPage.locator('.cart_item')).toHaveCount(0);
});

When('I enter first name {string}, last name {string}, and postal code {string}', async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
  const checkout = new CheckoutPage(this.uiPage);
  await checkout.firstNameInput.fill(firstName);
  await checkout.lastNameInput.fill(lastName);
  await checkout.postalCodeInput.fill(postalCode);
});

When('I continue to the order overview', async function (this: CustomWorld) {
  await new CheckoutPage(this.uiPage).continueButton.click();
  await expect(this.uiPage).toHaveURL(/checkout-step-two.html/);
});

Then('I should see the checkout overview for {string}', async function (this: CustomWorld, productName: string) {
  const checkout = new CheckoutPage(this.uiPage);
  await expect(checkout.checkoutItems.getByText(productName)).toBeVisible();
  await expect(checkout.checkoutItems.locator('.inventory_item_price')).toHaveText('$29.99');
  await expect(checkout.finishButton).toBeVisible();
});

Then('the item subtotal should be {string}', async function (this: CustomWorld, value: string) {
  await expect(new CheckoutPage(this.uiPage).subtotalLabel).toHaveText(value);
});

Then('the tax should be {string}', async function (this: CustomWorld, value: string) {
  await expect(new CheckoutPage(this.uiPage).taxLabel).toHaveText(value);
});

Then('the order total should be {string}', async function (this: CustomWorld, value: string) {
  await expect(new CheckoutPage(this.uiPage).totalLabel).toHaveText(value);
});

When('I finish the order', async function (this: CustomWorld) {
  await new CheckoutPage(this.uiPage).finishButton.click();
});

Then('I should see the order confirmation {string}', async function (this: CustomWorld, message: string) {
  await expect(this.uiPage).toHaveURL(/checkout-complete.html/);
  await expect(new CheckoutPage(this.uiPage).confirmationMessage).toHaveText(message);
  await expect(new CheckoutPage(this.uiPage).backHomeButton).toBeVisible();
});
