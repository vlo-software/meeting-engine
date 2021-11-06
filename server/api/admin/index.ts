import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import {
  deleteMeetingById,
  getMeetingById,
  getMeetings,
  postMeeting,
} from "./meetings";

const adminRouter = Router();
adminRouter.use(adminAuth);
adminRouter.get("/meetings", getMeetings);
adminRouter.get("/meetings/:id", getMeetingById);
adminRouter.post("/meetings", postMeeting);
adminRouter.delete("/meetings/:id", deleteMeetingById);

export const AdminRouter = adminRouter;
