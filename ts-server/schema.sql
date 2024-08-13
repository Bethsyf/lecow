CREATE TABLE Users (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Groups (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE GroupMembers (
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    PRIMARY KEY(groupId, userId),
    FOREIGN KEY(groupId) REFERENCES Groups(id),
    FOREIGN KEY(userId) REFERENCES Users(id)
);

CREATE UNIQUE INDEX GroupMembersPk on GroupMembers (groupId, userId);

CREATE TABLE Expenses (
    id SERIAL NOT NULL PRIMARY KEY,
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    expenseName VARCHAR(100) NOT NULL,
    amount DECIMAL(22, 2) NOT NULL CHECK (amount > 0),
    paidByUserId INTEGER NOT NULL,
    participants JSONB NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(groupId) REFERENCES Groups(id),
    FOREIGN KEY(userId) REFERENCES Users(id),
    FOREIGN KEY(paidByUserId) REFERENCES Users(id)
);

CREATE TABLE Balances (
    id SERIAL NOT NULL PRIMARY KEY,
    expenseId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amountDue DECIMAL(22, 2) NOT NULL CHECK (amountDue <> 0),
    FOREIGN KEY (expenseId) REFERENCES Expenses(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

