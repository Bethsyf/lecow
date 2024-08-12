Feature: Expenses

  Background:
    Given created users:
      | user |
      | A |
      | B |
      | C |
    And created groups:
      | group |
      | G1 |
      | G2 |

  Scenario: all users pay the same
    Given users belongs to group "G1":
      | user |
      | A |
      | B |
      | C |
    When user "A" pays for "food" the amount "90000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A |  60000.00 |
      | B | -30000.00 |
      | C | -30000.00 |
    When user "B" pays for "food" the amount "90000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A |  30000.00 |
      | B |  30000.00 |
      | C | -60000.00 |
    When user "C" pays for "food" the amount "90000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A | 0.00 |
      | B | 0.00 |
      | C | 0.00 |

  Scenario: all users pay some
    Given users belongs to group "G1":
      | user |
      | A |
      | B |
      | C |
    When user "A" pays for "food" the amount "90000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A |  60000.00 |
      | B | -30000.00 |
      | C | -30000.00 |
    When user "B" pays for "food" the amount "60000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A |  40000.00 |
      | B |  10000.00 |
      | C | -50000.00 |
    When user "C" pays for "food" the amount "30000.00" in group "G1"
    Then users have following balances:
      | user | balance |
      | A |  30000.00 |
      | B |      0.00 |
      | C | -30000.00 |
