Feature: Authentication API
  As an API consumer
  I want to authenticate and access protected endpoints
  So that unauthorized requests are handled correctly

  @auth-api
  Scenario: Access a protected endpoint with a valid token
    When I request my profile using the authenticated API client
    Then the API status should be 200
    And the authenticated profile should match the configured username

  @auth-api
  Scenario: Reject access without a token
    When I request my profile without a token
    Then the API status should be 401

  @auth-api
  Scenario: Reject access with an invalid token
    When I request my profile with an invalid token
    Then the API status should be 401

  @auth-api
  Scenario: Reuse a valid access token
    When I obtain authentication tokens twice
    Then the second access token should match the first access token

  @auth-api
  Scenario: Refresh the session and access the protected endpoint
    When I refresh the authentication session
    Then the refreshed tokens should be present
    And the refreshed access token should access my profile
