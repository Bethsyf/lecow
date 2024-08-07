import { EXPENSES_INSERT, EXPENSES_GET_BY_GROUP_ID } from "../lib/queries";
import { Database, ExpenseEntity } from "../types/app";

export default class ExpenseRepository {
  dbClient: Database;
  constructor(dbClient: Database) {
    this.dbClient = dbClient;
  }

  async getExpensesByGroupId(groupId: number): Promise<ExpenseEntity[]> {
    const { rows } = await this.dbClient.query(EXPENSES_GET_BY_GROUP_ID, [
      groupId,
    ]);
    return rows as ExpenseEntity[];
  }

  async createExpense(expense: ExpenseEntity): Promise<ExpenseEntity> {
    const { rows } = await this.dbClient.query(EXPENSES_INSERT, [
      expense.groupId,
      expense.userId,
      expense.expenseName,
      expense.amount,
      expense.paidByUserId,
    ]);
    return rows[0] as ExpenseEntity;
  }
}
