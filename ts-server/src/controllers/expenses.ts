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
  const { groupId, userId } = req.params;
  const expenseData = {
    ...req.body,
    groupId: Number(groupId),  
    userId: Number(userId)   
  };
  const newExpense = await service.createExpense(expenseData as ExpenseEntity);
  res.status(HTTP_CREATED).json(newExpense);
}

export async function getBalancesByUserId(req: Request, res: Response) {
  const service = new ExpenseService(req.dbClient);
  const userId = parseInt(req.params.userId, 10);
    const balances = await service.getBalancesByUserId(userId);
    res.status(HTTP_OK).json(balances);
}

export async function getBalancesByGroupId(req: Request, res: Response) {
  const service = new ExpenseService(req.dbClient);
  const groupId = parseInt(req.params.groupId, 10);
    const balances = await service.getBalancesByGroupId(groupId);
    res.status(HTTP_OK).json(balances);
}
