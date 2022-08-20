import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import {
  deleteBookingById,
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
adminRouter.delete(
  "/meetings/:id/teachers/:teacherId/bookings/:bookingId",
  deleteBookingById
);

export const AdminRouter = adminRouter;
