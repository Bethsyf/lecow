import { Request, Response, GroupEntity, MemberEntity } from "../types/app";
import Service from "../services/groups";
import { HTTP_CREATED, HTTP_OK } from "../lib/httpCodes";

export async function getAllGroups(req: Request, res: Response) {
  const service = new Service(req.dbClient);
  const result = await service.getAll();
  res.status(HTTP_OK).json(result);
}

export async function createGroup(req: Request, res: Response) {
  const service = new Service(req.dbClient);
  const newGroup = await service.create(req.body as GroupEntity);
  res.status(HTTP_CREATED).json(newGroup);
}

export async function getAllMembers(req: Request, res: Response) {
  const service = new Service(req.dbClient);
  const { groupId } = req.params;
  const members = await service.getAllMembers(Number(groupId));
  res.status(HTTP_OK).json(members);
}

export async function addMember(req: Request, res: Response) {
  const service = new Service(req.dbClient);
  const { groupId, userId } = req.body as MemberEntity;
  await service.addMember(Number(groupId), Number(userId));
  res.status(HTTP_CREATED).send();
}
