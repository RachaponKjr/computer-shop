import express from "express";
import {
  adminLogin,
  getUser,
  registerUser,
  userLogin,
} from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/admin", adminLogin);
userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.get("/getUser", verifyUser, getUser);

export default userRouter;
