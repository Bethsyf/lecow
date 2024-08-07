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
