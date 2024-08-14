/**
 * Apps types, entities, dtos, etc...
 */

import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import type { PoolClient } from "pg";

/// Request/Response
export type Database = PoolClient;
export type Request = ExpressRequest & {
  dbClient: Database;
};
export type Response = ExpressResponse;

/// Entities
export type NewUserDto = {
  name: string;
  email: string;
}

export type UserEntity = {
  id: number;
  name: string;
  email: string;
};

export type NewGroupDto = {
  name: string;
};

export type GroupEntity = {
  id: number;
  name: string;
};

export type GroupBalanceEntity = {
  id: number;
  name: string;
  balance: string;
}

export interface ExpenseEntity {
  id: number;
  groupId: number;
  userId: number;
  description: string;
  value: number;
  userCount: number;
}

export interface NewExpenseDto {
  groupId: number;
  userId: number;
  description: string;
  value: string;
  participants: number[];
}

export type Balance = {
  balance: string;
}