/**
 * All queries to db here
 */

export const USERS_GET_ALL = `
SELECT id, name, email FROM users;
`;

export const USERS_INSERT = `
INSERT INTO users (name, email)
VALUES ($1, $2)
RETURNING id, name, email;
`;

export const GROUPS_GET_ALL = `
SELECT id, name FROM groups;
`;

export const GROUPS_INSERT = `
INSERT INTO groups (name)
VALUES ($1)
RETURNING name;
`;

export const GROUP_MEMBERS_GET_BY_GROUP_ID = `
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
FROM
    groupMembers gm
JOIN
    users u ON gm.userId = u.id
WHERE
    gm.groupId = $1; 
`;

export const GROUP_MEMBERS_INSERT = `
INSERT INTO groupMembers (groupId, userId)
VALUES ($1, $2); 
`;

export const EXPENSES_INSERT = `
WITH new_expense AS (
    INSERT INTO Expenses (groupId, userId, expenseName, amount, paidByUserId, participants)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, groupId, userId, expenseName, amount, paidByUserId, participants, createdAt
),
participant_balances AS (
    SELECT 
        (p.value->>'userId')::INTEGER AS userId,
        (ne.amount / jsonb_array_length(ne.participants)) AS share
    FROM new_expense ne
    JOIN LATERAL jsonb_array_elements(ne.participants) AS p(value) ON true
),
payer_balance AS (
    SELECT 
        ne.id AS expenseId,
        ne.amount - (ne.amount / jsonb_array_length(ne.participants)) AS amountDue
    FROM new_expense ne
    WHERE ne.paidByUserId = $5
)
INSERT INTO Balances (expenseId, userId, amountDue)
SELECT 
    ne.id AS expenseId,
    p.userId,
    CASE
        WHEN p.userId = $5 THEN
            ps.amountDue  
        ELSE
            - p.share 
    END AS amountDue
FROM new_expense ne
JOIN participant_balances p ON p.userId = p.userId
LEFT JOIN payer_balance ps ON ps.expenseId = ne.id
WHERE p.userId != $5
UNION ALL
SELECT 
    ne.id AS expenseId,
    $5 AS userId,
    ps.amountDue
FROM new_expense ne
JOIN payer_balance ps ON ps.expenseId = ne.id
`;

export const EXPENSES_GET_BY_GROUP_ID = `
SELECT id, groupId, userId, expenseName, amount, paidByUserId, participants, createdAt
FROM Expenses
WHERE groupId = $1;
`;

export const BALANCES_GET_BY_USER_ID = `
SELECT d.id, d.expenseId, d.userId, d.amountDue, e.expenseName, e.amount, paidByUserId, participants
FROM Balances d
JOIN Expenses e ON d.expenseId = e.id
WHERE d.userId = $1;
`;

export const BALANCES_GET_BY_GROUP_ID = `
SELECT
    groupId,
    SUM(amount) AS totalExpenses
FROM
    Expenses
WHERE
    groupId = $1
GROUP BY
    groupId;
`;
