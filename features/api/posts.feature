Feature: Posts REST API
  As an API consumer
  I want to create, retrieve, update, and delete posts
  So that I can verify the REST API contract

  @posts-api
  Scenario: Get a single post and validate its response
    When I request post 1
    Then the API status should be 200
    And the response content type should contain "application/json"
    And the post response should have a valid schema
    And the post id should be 1

  @posts-api
  Scenario: A non-existent post returns 404
    When I request post 9999
    Then the API status should be 404

  @posts-api
  Scenario: Filter posts by user id
    When I request posts for user 1
    Then the API status should be 200
    And all returned posts should belong to user 1

  @posts-api
  Scenario: A user with no matching posts receives an empty list
    When I request posts for user 9999
    Then the API status should be 200
    And the posts response should be empty

  @posts-api
  Scenario: Create a post
    When I create a post with title "Playwright API Testing" and body "Learning POST requests with TypeScript" for user 1
    Then the API status should be 201
    And the created post should match the submitted data

  @posts-api
  Scenario: Replace a post using PUT
    When I replace post 1 with title "Updated Playwright API Testing" and body "Learning PUT requests with TypeScript" for user 1
    Then the API status should be 200
    And the updated post should match the submitted data

  @posts-api
  Scenario: Update a post title using PATCH
    When I patch post 1 with title "Updated title using PATCH"
    Then the API status should be 200
    And the returned post title should be "Updated title using PATCH"

  @posts-api
  Scenario: Delete a post
    When I delete post 1
    Then the API status should be 200
