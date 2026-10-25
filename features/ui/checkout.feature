Feature: Checkout
  As a shopper
  I want to enter delivery information and complete an order
  So that I can purchase products

  @ui @authenticated
  Scenario: Review checkout information and order totals
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout
    And I enter first name "Ankit", last name "Sharma", and postal code "160001"
    And I continue to the order overview
    Then I should see the checkout overview for "Sauce Labs Backpack"
    And the item subtotal should be "Item total: $29.99"
    And the tax should be "Tax: $2.40"
    And the order total should be "Total: $32.39"

  @ui @authenticated
  Scenario: Complete the order and verify confirmation
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout
    And I enter first name "Ankit", last name "Sharma", and postal code "160001"
    And I continue to the order overview
    And I finish the order
    Then I should see the order confirmation "Thank you for your order!"
