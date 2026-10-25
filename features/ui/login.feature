Feature: SauceDemo login
  As a shopper
  I want to authenticate
  So that I can access the inventory

  @ui
  Scenario: Valid user can log in successfully
    Given I open the SauceDemo login page
    When I log in as "standard_user" with password "secret_sauce"
    Then I should be on the inventory page

  @ui
  Scenario: Locked out user cannot log in
    Given I open the SauceDemo login page
    When I log in as "locked_out_user" with password "secret_sauce"
    Then I should see the login error "Epic sadface: Sorry, this user has been locked out."

  @ui
  Scenario: Invalid user cannot log in
    Given I open the SauceDemo login page
    When I log in as "invalid_user" with password "wrong_password"
    Then I should see the login error "Epic sadface: Username and password do not match any user in this service"

  @ui
  Scenario: Empty credentials show a validation error
    Given I open the SauceDemo login page
    When I log in as "" with password ""
    Then I should see the login error "Epic sadface: Username is required"
