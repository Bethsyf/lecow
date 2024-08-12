CREATE TABLE Users (
    id SERIAL NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    PRIMARY KEY(id)
);

CREATE TABLE Groups (
    id SERIAL NOT NULL,
    ownerUserId INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    PRIMARY KEY(id),
    FOREIGN KEY(ownerUserId) REFERENCES Users(id)
);

CREATE TABLE GroupMembers (
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    PRIMARY KEY(groupId, userId),
    FOREIGN KEY(groupId) REFERENCES Groups(id) ON DELETE CASCADE,
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX GroupMembersPk on GroupMembers (groupId, userId)

CREATE TABLE Expenses (
    id SERIAL NOT NULL,
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    expenseName VARCHAR(100) NOT NULL,
    amount DECIMAL(22, 2) NOT NULL CHECK (amount > 0),
    paidByUserId INTEGER NOT NULL,
    participants INTEGER NOT NULL CHECK (participants > 0),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    PRIMARY KEY(id),
    FOREIGN KEY(groupId) REFERENCES Groups(id),
    FOREIGN KEY(userId) REFERENCES Users(id),
    FOREIGN KEY(paidByUserId) REFERENCES Users(id)
);

CREATE TABLE Balances (
    id SERIAL NOT NULL,
    expenseId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amountDue DECIMAL(22, 2) NOT NULL CHECK (BALANCE <> 0),
    PRIMARY KEY(id),
    FOREIGN KEY(expenseId) REFERENCES Expenses(id),
    FOREIGN KEY(userId) REFERENCES Users(id)
);
