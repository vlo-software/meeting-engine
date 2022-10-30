import { Request, Response } from "express";
import { MeetingService } from "../../services/meetingService";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import { readFileSync } from "fs";
import { resolve } from "path";

const classes = JSON.parse(
  readFileSync(resolve(process.cwd(), "config/classes.json"), {
    encoding: "utf8",
  })
);

const idSchema = Joi.string()
  .length(24)
  .regex(/[0-9a-fA-F]+/)
  .required();

const bookerTokenSchema = Joi.string()
  .length(36)
  .regex(/[0-9a-fA-F-]+/)
  .required();

const userNameSchema = Joi.string().min(5).max(60).required();

const emailSchema = Joi.string().email().required();

const classNameSchema = Joi.string()
  .valid(...classes)
  .required();

export const getMeetingById = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id } = req.params;
  if (!req.signedCookies.bookerToken) {
    const bookerToken = uuidv4();
    res.cookie("bookerToken", bookerToken, {
      signed: true,
      httpOnly: true,
    });
  }
  try {
    res.json({
      meeting: await meetingService.getMeetingById(
        await idSchema.validateAsync(id)
      ),
    });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};
export const getHoursByTeacherId = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId } = req.params;
  if (!req.signedCookies.bookerToken) {
    res.status(403);
    res.json({ res: "Missing cookie." });
  }
  try {
    res.json({
      hours: await meetingService.getAvailableHoursByTeacherId(
        await idSchema.validateAsync(id),
        await idSchema.validateAsync(teacherId),
        req.signedCookies.bookerToken
      ),
    });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};
export const getBookingByTeacherId = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId } = req.params;
  if (!req.signedCookies.bookerToken) {
    res.status(403);
    res.json({ res: "Missing cookie." });
  }
  try {
    res.json({
      booking: await meetingService.getBookingByTeacherId(
        await idSchema.validateAsync(id),
        await idSchema.validateAsync(teacherId),
        req.signedCookies.bookerToken
      ),
    });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};
export const addBooking = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, hourId } = req.params;
  const { username, classname } = req.body;
  if (!req.signedCookies.bookerToken) {
    res.status(403);
    res.json({ res: "Missing cookie." });
  }

  try {
    await meetingService.addBooking(
      await idSchema.validateAsync(id),
      await idSchema.validateAsync(teacherId),
      await idSchema.validateAsync(hourId),
      await userNameSchema.validateAsync(username),
      await classNameSchema.validateAsync(classname),
      req.signedCookies.bookerToken,
      res.locals.emailTransporter,
      await emailSchema.validateAsync(req.body.email)
    );
    res.json({ res: "Booking added." });
  } catch (e: any) {
    res.status(400).json({ res: e.message });
  }
};

export const confirmBookingByLink = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, bookingId } = req.params;
  try {
    await meetingService.confirmBooking(
      await idSchema.validateAsync(id),
      await idSchema.validateAsync(teacherId),
      await idSchema.validateAsync(bookingId),
      res.locals.emailTransporter
    );
    res.json({ res: "Booking confirmed." });
  } catch (e: any) {
    res.status(400).json({ res: e.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId } = req.params;
  if (!req.signedCookies.bookerToken) {
    res.status(403);
    res.json({ res: "Missing cookie." });
  }
  try {
    await meetingService.deleteBooking(
      await idSchema.validateAsync(id),
      await idSchema.validateAsync(teacherId),
      req.signedCookies.bookerToken
    );
    res.json({ res: "Booking removed." });
  } catch (e: any) {
    res.status(400).json({ res: e.message });
  }
};

export const deleteBookingByLink = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, bookerToken } = req.params;
  try {
    await meetingService.deleteBooking(
      await idSchema.validateAsync(id),
      await idSchema.validateAsync(teacherId),
      await bookerTokenSchema.validateAsync(bookerToken)
    );
    res.json({ res: "Booking removed." });
  } catch (e: any) {
    res.status(400).json({ res: e.message });
  }
};
