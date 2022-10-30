import { Router } from "express";
import {
  getMeetingById,
  getHoursByTeacherId,
  getBookingByTeacherId,
  addBooking,
  confirmBookingByLink,
  deleteBooking,
  deleteBookingByLink,
} from "./meetings";

const meetingRouter = Router();
meetingRouter.get("/:id", getMeetingById);
meetingRouter.get("/:id/teachers/:teacherId/hours", getHoursByTeacherId);
meetingRouter.get("/:id/teachers/:teacherId/booking", getBookingByTeacherId);
meetingRouter.post("/:id/teachers/:teacherId/hours/:hourId", addBooking);
meetingRouter.post(
  "/:id/teachers/:teacherId/bookings/:bookingId",
  confirmBookingByLink
);
meetingRouter.delete("/:id/teachers/:teacherId", deleteBooking);
meetingRouter.delete(
  "/:id/teachers/:teacherId/booker/:bookerToken",
  deleteBookingByLink
);
export const MeetingRouter = meetingRouter;
