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
  password: string;
};

export type UserEntity = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type NewGroupDto = {
  ownerUserId: number;
  name: string;
  color: string;
};

export type GroupEntity = {
  id: number;
  ownerUserId: number;
  name: string;
  color: string;
};

export interface MemberEntity {
  groupId: number;
  userId: number;
}

export type GroupBalanceEntity = {
  id: number;
  name: string;
  balance: string;
};

export interface ExpenseEntity {
  id: number;
  groupId: number;
  userId: number;
  expenseName: string;
  amount: number;
  paidByUserId: number;
  participants: number[];
}

export interface NewExpenseDto {
  groupId: number;
  userId: number;
  expenseName: string;
  amount: number;
  paidByUserId: number;
  participants: number[];
}

export type Balance = {
  balance: string;
};
