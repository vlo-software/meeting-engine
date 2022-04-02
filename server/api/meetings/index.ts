import { Router } from "express";
import {
  getMeetingById,
  getHoursByTeacherId,
  addBooking,
  deleteBooking,
} from "./meetings";

const meetingRouter = Router();
meetingRouter.get("/:id", getMeetingById);
meetingRouter.get("/:id/teachers/:teacherId/hours", getHoursByTeacherId);
meetingRouter.post("/:id/teachers/:teacherId/hours/:hourId", addBooking);
meetingRouter.delete("/:id/teachers/:teacherId", deleteBooking);
export const MeetingRouter = meetingRouter;
