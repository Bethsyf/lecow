/**
 * All queries to db here
 */

export const USERS_GET_ALL = `
SELECT id, name, email, password FROM users;
`;

export const USERS_INSERT = `
INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING id, name, email;
`;

export const GROUPS_GET_ALL = `
SELECT id, name, COLOR FROM groups;
`;

export const GROUPS_INSERT = `
INSERT INTO groups (ownerUserId, name, color)
VALUES ($1, $2, $3)
RETURNING name, color;
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
INSERT INTO Expenses (groupId, userId, expenseName, amount, paidByUserId, participants)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, groupId, userId, expenseName, amount, paidByUserId, participants, createdAt;
`;

export const EXPENSES_GET_BY_GROUP_ID = `
SELECT id, groupId, userId, expenseName, amount, paidByUserId, participants, createdAt
FROM Expenses
WHERE groupId = $1;
`;

export const DEBTS_GET_BY_USER_ID = `
SELECT d.id, d.expenseId, d.userId, d.amountDue, e.expenseName, e.amount, paidByUserId, participants
FROM Debts d
JOIN Expenses e ON d.expenseId = e.id
WHERE d.userId = $1;
`;
