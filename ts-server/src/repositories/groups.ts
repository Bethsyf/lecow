import {
  GROUPS_GET_ALL,
  GROUPS_INSERT,
  GROUP_MEMBERS_GET_BY_GROUP_ID,
  GROUP_MEMBERS_INSERT,
} from "../lib/queries";
import { Database, GroupEntity, UserEntity } from "../types/app";

export default class Repository {
  dbClient: Database;
  constructor(dbClient: Database) {
    this.dbClient = dbClient;
  }

  async getAll(): Promise<GroupEntity[]> {
    const { rows } = await this.dbClient.query(GROUPS_GET_ALL);
    return rows as GroupEntity[];
  }

  async create(group: GroupEntity): Promise<GroupEntity> {
    const { rows } = await this.dbClient.query(GROUPS_INSERT, [
      group.ownerUserId,
      group.name,
      group.color,
    ]);
    return rows[0] as GroupEntity;
  }

  async getAllMembers(groupId: number): Promise<UserEntity[]> {
    const { rows } = await this.dbClient.query(GROUP_MEMBERS_GET_BY_GROUP_ID, [
      groupId,
    ]);
    return rows as UserEntity[];
  }

  async addMember(groupId: number, userId: number): Promise<void> {
    await this.dbClient.query(GROUP_MEMBERS_INSERT, [groupId, userId]);
  }
}
