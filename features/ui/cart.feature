Feature: Shopping cart
  As a shopper
  I want to add and remove products
  So that I can manage my cart before checkout

  @ui @authenticated
  Scenario: Add a product and verify it in the cart
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    When I open the shopping cart
    Then the cart should contain "Sauce Labs Backpack" priced "$29.99"

  @ui @authenticated
  Scenario: Proceed from the cart to checkout
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout
    Then I should be on the checkout information page

  @ui @authenticated
  Scenario: Remove a product from the inventory page
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    When I remove "Sauce Labs Backpack" from the inventory
    Then the cart should be empty

  @ui @authenticated
  Scenario: Remove a product from the cart page
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
