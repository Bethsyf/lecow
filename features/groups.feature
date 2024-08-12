Feature: Groups

  Scenario: create a group
    When a group creation with name "Group {user}" is requested
    Then group is created correctly