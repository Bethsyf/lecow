Feature: Invites
  
  Background:
    Given created users:
      | user |
      | A |
    And created groups:
      | group |
      | G1 |

  Scenario: Invite a user to group
    When user "A" is invited to group "G1"
    Then the invite was successful

  Scenario: User already invited
    When user "A" is invited to group "G1"
    Then the invite was successful
    When user "A" is invited to group "G1"
    Then the invite was not successful
