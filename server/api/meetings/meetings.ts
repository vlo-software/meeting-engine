import { Request, Response } from "express";
import { MeetingService } from "../../services/meetingService";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

const idSchema = Joi.string()
  .length(24)
  .regex(/[0-9a-fA-F]+/);

const userNameSchema = Joi.string().min(5).max(60);

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
export const addBooking = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, hourId } = req.params;
  const { username } = req.body;
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
      req.signedCookies.bookerToken
    );
    res.json({ res: "Booking added." });
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
