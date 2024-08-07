import { ErrorRequestHandler, RequestHandler, Router } from "express";
import continuator from "./lib/continue.decorator";
import { createUser, getAllUsers } from "./controllers/users";
import {
  addMember,
  createGroup,
  getAllGroups,
  getAllMembers,
} from "./controllers/groups";
import {
  commitDatabase,
  connectDatabase,
  rollbackDatabase,
} from "./lib/database.middleware";
import { createExpense, getDebtsByUserId, getExpensesByGroup } from "./controllers/expenses";

const router = Router();

// keep this at the beginning
router.use(connectDatabase as RequestHandler);

// app routers below
router.get("/api/v1/users", continuator(getAllUsers));
router.post("/api/v1/users", continuator(createUser));
router.get("/api/v1/groups", continuator(getAllGroups));
router.post("/api/v1/groups", continuator(createGroup));
router.get("/api/v1/groups/members/:groupId", continuator(getAllMembers));
router.post("/api/v1/groups/members", continuator(addMember));
router.get("/api/v1/expenses/:groupId", continuator(getExpensesByGroup));
router.post("/api/v1/expenses", continuator(createExpense));
router.get("/api/v1/expenses/debts/:userId", continuator(getDebtsByUserId));

// keep this at the end
router.use(commitDatabase as RequestHandler);
router.use(rollbackDatabase as ErrorRequestHandler);

export default router;
