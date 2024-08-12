Feature: Users

  Scenario: create an user
    When a user creation with name "User {user}" and email "{user}@lecow.com" is requested
    Then user is created correctly