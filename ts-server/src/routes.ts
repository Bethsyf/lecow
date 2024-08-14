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
import { createExpense, getBalancesByGroupId, getBalancesByUserId, getExpensesByGroup } from "./controllers/expenses";

const router = Router();

// keep this at the beginning
router.use(connectDatabase as RequestHandler);
      
// app routers below

router.post("/api/v1/groups/:groupId/users/:userId", continuator(addMember));
router.get("/api/v1/users", continuator(getAllUsers));
router.post("/api/v1/users", continuator(createUser));
router.get("/api/v1/groups", continuator(getAllGroups));
router.post("/api/v1/groups", continuator(createGroup));
router.get("/api/v2/members/:groupId", continuator(getAllMembers));
router.get("/api/v1/expenses/:groupId", continuator(getExpensesByGroup));
router.post("/api/v1/expenses", continuator(createExpense));
router.get("/api/v1/expenses/balances/:userId", continuator(getBalancesByUserId));
router.get("/api/v1/expenses/total-balances/:groupId", continuator(getBalancesByGroupId));
 
// keep this at the end
router.use(commitDatabase as RequestHandler);
router.use(rollbackDatabase as ErrorRequestHandler);

export default router;
