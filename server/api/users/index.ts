import { Router } from "express";
import { postLogin } from "./login";

const loginRouter = Router();
loginRouter.post("/login", postLogin);

export const LoginRouter = loginRouter;
