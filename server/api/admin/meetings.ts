import { Request, Response } from "express";
import { MeetingService } from "../../services/meetingService";
import Joi from "joi";

const postMeetingSchema = Joi.object({
  startsAt: Joi.number().min(0).required(),
  endsAt: Joi.number().min(0).greater(Joi.ref("startsAt")).required(),
  teacherIds: Joi.array().items(Joi.number().min(0)).required(),
});
const idSchema = Joi.string()
  .length(24)
  .regex(/[0-9a-fA-F]+/);

export const getMeetings = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  res.json(await meetingService.getAllMeetingsUnsafe());
};

export const getMeetingById = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id } = req.params;
  try {
    res.json({
      meeting: await meetingService.getMeetingByIdUnsafe(
        await idSchema.validateAsync(id)
      ),
    });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};

export const postMeeting = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  try {
    const body = await postMeetingSchema.validateAsync(req.body);
    await meetingService.addMeetingUnsafe(body);
    res.sendStatus(201);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};

export const deleteMeetingById = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, bookingId } = req.params;
  try {
    await meetingService.deleteMeetingByIdUnsafe(
      await idSchema.validateAsync(id)
    );
    res.sendStatus(200);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};

export const deleteBookingById = async (req: Request, res: Response) => {
  const meetingService = new MeetingService();
  const { id, teacherId, bookingId } = req.params;
  try {
    await meetingService.deleteBookingUnsafe(
      await idSchema.validateAsync(id),
      await idSchema.validateAsync(teacherId),
      await idSchema.validateAsync(bookingId)
    );
    res.sendStatus(200);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};
