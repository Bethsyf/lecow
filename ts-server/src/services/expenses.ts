import ExpenseRepository from "../repositories/expenses";
import { Database, ExpenseEntity } from "../types/app";

export default class ExpenseService {
  expenseRepo: ExpenseRepository;

  constructor(dbClient: Database) {
    this.expenseRepo = new ExpenseRepository(dbClient);
  }

  async getExpensesByGroupId(groupId: number): Promise<ExpenseEntity[]> {
    return await this.expenseRepo.getExpensesByGroupId(groupId);
  }

  async createExpense(expense: ExpenseEntity): Promise<ExpenseEntity> {
    return await this.expenseRepo.createExpense(expense);
  }
}
