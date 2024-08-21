/**
 * All queries to db here
 */

export const USERS_GET_ALL = `
SELECT id, name, email FROM Users;
`;

export const USERS_INSERT = `
INSERT INTO Users (name, email)
VALUES ($1, $2)
RETURNING id, name, email;
`;

export const GROUPS_GET_ALL = `
SELECT id, name FROM Groups;
`;

export const GROUPS_INSERT = `
INSERT INTO Groups (name)
VALUES ($1)
RETURNING id, name;
`;

export const GROUP_MEMBERS_GET_BY_GROUP_ID = `
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
FROM
    GroupMembers gm
JOIN
    Users u ON gm.userId = u.id
WHERE
    gm.groupId = $1; 
`;

export const GROUP_MEMBERS_INSERT = `
INSERT INTO GroupMembers (groupId, userId)
VALUES ($1, $2); 
`;

export const EXPENSES_INSERT = `
WITH new_expense AS (
    INSERT INTO Expenses (groupId, userId, description, value, participants)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, groupId, userId, description, value, participants, createdAt
),
participant_balances AS (
    SELECT 
        (p.value->>'userId')::INTEGER AS userId,
        (ne.value / jsonb_array_length(ne.participants)) AS share
    FROM new_expense ne
    JOIN LATERAL jsonb_array_elements(ne.participants) AS p(value) ON true
),
payer_balance AS (
    SELECT 
        ne.id AS expenseId,
        ne.value - (ne.value / jsonb_array_length(ne.participants)) AS balance
    FROM new_expense ne
    WHERE ne.userId = $2
)
INSERT INTO Balances (expenseId, userId, balance)
SELECT 
    ne.id AS expenseId,
    p.userId,
    CASE
        WHEN p.userId = $2 THEN
            pb.balance
        ELSE
            -p.share 
    END AS balance
FROM new_expense ne
JOIN participant_balances p ON p.userId = p.userId
LEFT JOIN payer_balance pb ON pb.expenseId = ne.id
WHERE p.userId != $2
UNION ALL
SELECT 
    ne.id AS expenseId,
    $2 AS userId,
    pb.balance
FROM new_expense ne
JOIN payer_balance pb ON pb.expenseId = ne.id;
`;

export const EXPENSES_GET_BY_GROUP_ID = `
SELECT id, groupId, userId, description, value, participants, createdAt
FROM Expenses
WHERE groupId = $1;
`;

export const BALANCES_GET_BY_USER_ID = `
SELECT b.id, b.expenseId, b.userId, b.balance, e.description, e.value, e.participants
FROM Balances b
JOIN Expenses e ON b.expenseId = e.id
WHERE b.userId = $1;
`;

export const BALANCES_GET_BY_GROUP_ID = `
SELECT
    e.groupId,
    SUM(e.value) AS totalExpenses
FROM
    Expenses e
WHERE
    e.groupId = $1
GROUP BY
    e.groupId;
`;
