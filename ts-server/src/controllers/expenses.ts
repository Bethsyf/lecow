import { ExpenseEntity, Request, Response } from "../types/app";
import ExpenseService from "../services/expenses";
import { HTTP_CREATED, HTTP_OK } from "../lib/httpCodes";

export async function getExpensesByGroup(req: Request, res: Response) {
  const service = new ExpenseService(req.dbClient);
  const groupId = Number(req.params.groupId);
  const expenses = await service.getExpensesByGroupId(groupId);
  res.status(HTTP_OK).json(expenses);
}

export async function createExpense(req: Request, res: Response) {
  const service = new ExpenseService(req.dbClient);
  const newExpense = await service.createExpense(req.body as ExpenseEntity);
  res.status(HTTP_CREATED).json(newExpense);
}
