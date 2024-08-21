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
    description VARCHAR(100) NOT NULL,
    value DECIMAL(22, 2) NOT NULL CHECK (value > 0),
    participants JSONB NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(groupId) REFERENCES Groups(id),
    FOREIGN KEY(userId) REFERENCES Users(id)
);

CREATE TABLE Balances (
    id SERIAL NOT NULL PRIMARY KEY,
    expenseId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    balance DECIMAL(22, 2) NOT NULL CHECK (balance <> 0),
    FOREIGN KEY (expenseId) REFERENCES Expenses(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

