import { Router } from "express";
import {
  getMeetingById,
  getHoursByTeacherId,
  getBookingByTeacherId,
  addBooking,
  deleteBooking,
} from "./meetings";

const meetingRouter = Router();
meetingRouter.get("/:id", getMeetingById);
meetingRouter.get("/:id/teachers/:teacherId/hours", getHoursByTeacherId);
meetingRouter.get("/:id/teachers/:teacherId/booking", getBookingByTeacherId);
meetingRouter.post("/:id/teachers/:teacherId/hours/:hourId", addBooking);
meetingRouter.delete("/:id/teachers/:teacherId", deleteBooking);
export const MeetingRouter = meetingRouter;
