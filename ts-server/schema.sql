CREATE TABLE Users (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE Groups (
    id SERIAL,
    ownerUserId INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE Expenses (
    id SERIAL,
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    expenseName VARCHAR(100) NOT NULL,
    amount DECIMAL(22, 2) NOT NULL CHECK (amount > 0),
    paidByUserId INTEGER NOT NULL,
    participants JSON NOT NULL,
    createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(groupId) REFERENCES Groups(id) ON DELETE CASCADE,
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY(paidByUserId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Debts (
    id SERIAL,
    expenseId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amountDue DECIMAL(22, 2) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(expenseId) REFERENCES Expenses(id) ON DELETE CASCADE,
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION distribute_expense_debts()
RETURNS TRIGGER AS $$
DECLARE
    total_amount NUMERIC; -- Monto total del gasto
    participants_count INTEGER; -- Número de participantes
    amount_per_participant NUMERIC; -- Monto por participante
    participant RECORD; -- Variable para iterar sobre participantes
BEGIN
    -- Obtener el monto total del gasto
    SELECT amount INTO total_amount FROM Expenses WHERE id = NEW.id;

    -- Contar el número de participantes en el grupo
    SELECT COUNT(userId) INTO participants_count 
    FROM GroupMembers 
    WHERE groupId = (SELECT groupId FROM Expenses WHERE id = NEW.id);

    -- Calcular la cantidad a deber por participante
    amount_per_participant = total_amount / participants_count;

    -- Insertar deudas para cada participante
    FOR participant IN
        SELECT userId FROM GroupMembers 
        WHERE groupId = (SELECT groupId FROM Expenses WHERE id = NEW.id)
    LOOP
        INSERT INTO Debts (expenseId, userId, amountDue)
        VALUES (NEW.id, participant.userId, CASE
            WHEN participant.userId = NEW.paidByUserId THEN amount_per_participant * (participants_count - 1)
            ELSE -amount_per_participant
        END);
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;  

CREATE TRIGGER after_expense_insert
AFTER INSERT ON Expenses
FOR EACH ROW
EXECUTE FUNCTION distribute_expense_debts();
