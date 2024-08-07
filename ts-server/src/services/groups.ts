import GroupRepo from "../repositories/groups";
import { Database, GroupEntity, UserEntity } from "../types/app";

export default class Service {
  groupRepo: GroupRepo;
  constructor(dbClient: Database) {
    this.groupRepo = new GroupRepo(dbClient);
  }

  async getAll(): Promise<GroupEntity[]> {
    return await this.groupRepo.getAll();
  }

  async create(group: GroupEntity): Promise<GroupEntity> {
    return await this.groupRepo.create(group);
  }

  async getAllMembers(groupId: number): Promise<UserEntity[]> {
    return await this.groupRepo.getAllMembers(groupId);
  }

  async addMember(groupId: number, userId: number): Promise<void> {
    await this.groupRepo.addMember(groupId, userId);
  }
}
