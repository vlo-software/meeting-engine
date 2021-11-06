import { Router } from "express";
import { getTeacherConfig } from "./teachers";

const teachersRouter = Router();
teachersRouter.get("/", getTeacherConfig);

export const TeachersRouter = teachersRouter;
