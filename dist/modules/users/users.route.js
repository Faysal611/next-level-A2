import { Router } from "express";
import { verify } from "../../middleware/verify.js";
import { usersController } from "./users.controller.js";
const router = Router();
router.get("/", verify("admin"), usersController.getAllUsers);
router.put("/:userId", verify("admin", "customer"), usersController.updateUser);
router.delete("/:userId", verify("admin"), usersController.deleteUser);
export const usersRouter = router;
