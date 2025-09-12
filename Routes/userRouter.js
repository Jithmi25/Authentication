import express from "express";
import { createUser,LoginUser,ForgotPassword,ResetPassword } from "../Controllers/userControlers.js";

const userRouter = express.Router();

// Define Routes
userRouter.post("/register", createUser); 
userRouter.post("/login", LoginUser);
userRouter.post("/forgetPassword",ForgotPassword);
userRouter.post("/resetPassword", ResetPassword);

export default userRouter;
