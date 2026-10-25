Feature: Inventory and product sorting
  As a shopper
  I want to inspect products and sort the inventory
  So that I can find products easily

  @ui @authenticated
  Scenario: Six products are displayed
    Given I am on the inventory page
    Then I should see 6 products

  @ui @authenticated
  Scenario: Product details are displayed
    Given I am on the inventory page
    When I open the "Sauce Labs Backpack" product
    Then I should see product details for "Sauce Labs Backpack"
    And the product price should be "$29.99"
    And the add to cart button should be visible
    And the back to products button should be visible
    And the product image should be visible

  @ui @authenticated
  Scenario: Sort products by name A to Z
    Given I am on the inventory page
    When I sort products by "az"
    Then products should be sorted by "name ascending"

  @ui @authenticated
  Scenario: Sort products by name Z to A
    Given I am on the inventory page
    When I sort products by "za"
    Then products should be sorted by "name descending"

  @ui @authenticated
  Scenario: Sort products by price low to high
    Given I am on the inventory page
    When I sort products by "lohi"
    Then products should be sorted by "price ascending"

  @ui @authenticated
  Scenario: Sort products by price high to low
    Given I am on the inventory page
    When I sort products by "hilo"
    Then products should be sorted by "price descending"
