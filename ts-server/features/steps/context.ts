import { omit } from "lodash";
import { expect } from "expect";
import { HTTP_CREATED, HTTP_OK } from "../../src/lib/httpCodes";
import {
  NewUserDto,
  UserEntity,
  NewGroupDto,
  GroupEntity,
  ExpenseEntity,
  NewExpenseDto,
  Balance,
} from "../../src/types/app";
import { replacer } from "./utils";

export type CreateUser = {
  user: string;
};

export type CreateGroup = {
  group: string;
};

export type CreateExpense = {
  user: string;
  group: string;
  description: string;
  amount: string;
  participants: string[];
};

export type UserBalance = {
  user: string;
  balance: string;
};

export type UserCtx = {
  input: NewUserDto;
  response?: Response;
  result?: UserEntity;
};

export type GroupCtx = {
  input: NewGroupDto;
  response?: Response;
  result?: GroupEntity;
};

export type ExpenseCtx = {
  input: CreateExpense;
  requestBody: NewExpenseDto;
  response?: Response;
  result?: ExpenseEntity;
};

function toKey(txt: string) {
  return `{${txt}}`;
}

type CreateOpts = {
  recordId?: string;
  noValidate?: boolean;
};

export default class Context {
  static baseUrl = "http://localhost:3000/api/v1";
  static usersUrl = `${Context.baseUrl}/users`;
  static groupsUrl = `${Context.baseUrl}/groups`;

  private users: Record<string, UserCtx> = {};
  private groups: Record<string, GroupCtx> = {};
  private lastInvite?: Response;
  private replace = replacer();

  validateUserCtx(userCtx: UserCtx | undefined) {
    expect(userCtx).toBeDefined();
    expect(userCtx?.input).toBeDefined();
    expect(userCtx?.response?.status).toBe(HTTP_CREATED);
    expect(userCtx?.result?.id).toBeDefined();
    expect(userCtx?.result).toMatchObject(userCtx!.input);
  }

  validateGroupCtx(groupCtx: GroupCtx | undefined) {
    expect(groupCtx).toBeDefined();
    expect(groupCtx?.input).toBeDefined();
    expect(groupCtx?.response?.status).toBe(HTTP_CREATED);
    expect(groupCtx?.result?.id).toBeDefined();
    expect(groupCtx?.result).toMatchObject(groupCtx!.input);
  }

  validateExpenseCtx(groupCtx: ExpenseCtx | undefined) {
    expect(groupCtx).toBeDefined();
    expect(groupCtx?.input).toBeDefined();
    expect(groupCtx?.requestBody).toBeDefined();
    expect(groupCtx?.response?.status).toBe(HTTP_CREATED);
    expect(groupCtx?.result?.id).toBeDefined();
    expect(groupCtx?.result).toMatchObject(
      omit(groupCtx!.requestBody, ["participants"]),
    );
  }

  async createUser(
    nametpl: string,
    emailtpl: string,
    opts: CreateOpts = {
      noValidate: false,
    },
  ) {
    const input = {
      name: this.replace(nametpl),
      email: this.replace(emailtpl),
    };
    const id = opts.recordId ?? input.email;
    const response = await fetch(Context.usersUrl, {
      method: "post",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.users[id] = {
      input,
      response,
      result: await response.json(),
    };
    if (!opts.noValidate) {
      this.validateUserCtx(this.users[id]);
    }
    return this.users[id];
  }

  async createGroup(
    nametpl: string,
    opts: CreateOpts = {
      noValidate: false,
    },
  ) {
    const input = {
      name: this.replace(nametpl),
    };
    const id = opts.recordId ?? input.name;
    const response = await fetch(Context.groupsUrl, {
      method: "post",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.groups[id] = {
      input,
      response,
      result: await response.json(),
    };
    if (!opts.noValidate) {
      this.validateGroupCtx(this.groups[id]);
    }
    return this.groups[id];
  }

  async createExpense(
    expense: CreateExpense,
    opts: CreateOpts = {
      noValidate: false,
    },
  ) {
    const userId = this.users[this.replace(expense.user)].result?.id;
    const groupId = this.groups[this.replace(expense.group)].result?.id;
    expect(userId).toBeDefined();
    expect(groupId).toBeDefined();
    const input: NewExpenseDto = {
      groupId: groupId!,
      userId: userId!,
      description: expense.description,
      value: expense.amount,
      participants: expense.participants.map((p) => {
        const id = this.users[this.replace(p)].result?.id;
        expect(id).toBeDefined();
        return id!;
      }),
    };
    const url = `${Context.baseUrl}/groups/${groupId}/users/${userId}/expenses`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: ExpenseCtx = {
      input: expense,
      requestBody: input,
      response,
      result: await response.json(),
    };
    if (!opts.noValidate) {
      this.validateExpenseCtx(result);
    }
    return result;
  }

  async createUsers(data: CreateUser[]) {
    const results = [];
    for (let index = 0; index < data.length; index++) {
      const id = data[index].user;
      const key = toKey(id);
      const r = await this.createUser(`u${key}`, `u${key}@lecow.com`, {
        recordId: id,
      });
      results.push(r);
    }
    return results;
  }

  async createGroups(data: CreateGroup[]) {
    for (let index = 0; index < data.length; index++) {
      const id = data[index].group;
      const key = toKey(id);
      await this.createGroup(`g${key}`, {
        recordId: id,
      });
    }
  }

  async validateUserBalance(user: string, balance: string) {
    const userId = this.users[this.replace(user)]?.result?.id;
    expect(userId).toBeDefined();
    const url = `${Context.baseUrl}/users/${userId}/balance`;
    const response = await fetch(url);
    expect(response.status).toBe(HTTP_OK);
    const balanceResult = (await response.json()) as Balance;
    expect(balanceResult).toBeDefined();
    expect(balanceResult).toMatchObject({
      balance,
    });
  }

  async validateUsersBalance(data: UserBalance[]) {
    for (let idx = 0; idx < data.length; idx++) {
      const item = data[idx];
      await this.validateUserBalance(item.user, item.balance);
    }
  }

  inviteUrlFor(user: string, group: string) {
    const userId = this.users[user]?.result?.id;
    const groupId = this.groups[group]?.result?.id;
    expect(userId).toBeDefined();
    expect(groupId).toBeDefined();
    const url = `${Context.baseUrl}/groups/${groupId}/users/${userId}`;
    return {
      url,
      groupId,
      userId,
    };
  }

  async invite(userId: string, groupId: string) {
    const invite = this.inviteUrlFor(userId, groupId);
    this.lastInvite = await fetch(invite.url, {
      method: "post",
    });
    return {
      ...invite,
      response: this.lastInvite,
    };
  }

  async inviteAll(users: CreateUser[], groupId: string) {
    const results = [];
    for (let idx = 0; idx < users.length; idx++) {
      const user = users[idx].user;
      const invite = await this.invite(user, groupId);
      results.push(invite);
      this.validateInvite(invite.response);
    }
    return results;
  }

  wasLastInvite(status: number) {
    this.validateInvite(this.lastInvite, status);
  }

  validateInvite(invite?: Response, status: number = HTTP_CREATED) {
    expect(invite).toBeDefined();
    expect(invite?.status).toBe(status);
  }
}
