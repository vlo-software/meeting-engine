import { Meeting, IMeeting } from "../../database/models/meeting";
import mongoose from "mongoose";
const { Types: MongooseTypes, Model } = mongoose;
import { TeachersService } from "./teachersService";
import { MeetingDTO } from "../models/dto/meeting";
import { HourDTO } from "../models/dto/hours";

export class MeetingService {
  private readonly model: typeof Model;
  private readonly teacherService: TeachersService;
  constructor() {
    this.model = Meeting;
    this.teacherService = new TeachersService();
  }
  // Admin methods
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * !!! IT WILL EXPOSE PERSONAL DATA !!!
   * @returns All meetings from the database in their raw form.
   */
  public async getAllMeetingsUnsafe(): Promise<Array<IMeeting>> {
    const rawMeetings = await this.model.find();
    return rawMeetings
      .map((item: any) => item.toObject())
      .filter(
        (item: IMeeting) => item.endsAt >= new Date().getTime()
      ) as Array<IMeeting>;
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * !!! IT WILL EXPOSE PERSONAL DATA !!!
   * @param meetingId - Meeting _id from the database
   * @returns Meeting from the database in its raw form.
   */
  public async getMeetingByIdUnsafe(
    meetingId: string
  ): Promise<IMeeting | null> {
    const meeting = await this.model.findById(
      new MongooseTypes.ObjectId(meetingId)
    );
    if (meeting === null || meeting.endsAt < new Date().getTime()) {
      return null;
    }
    return meeting ? (meeting.toObject() as IMeeting) : null;
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * It will just delete the meeting without asking questions.
   * @param meetingId - Meeting _id from the database
   */
  public async deleteMeetingByIdUnsafe(meetingId: string): Promise<void> {
    await this.model.findByIdAndDelete(new MongooseTypes.ObjectId(meetingId));
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * It will create a new meeting without asking questions.
   * @param data - Information about the meeting to create
   */
  public async addMeetingUnsafe({
    startsAt,
    endsAt,
    teacherIds,
  }: {
    startsAt: number;
    endsAt: number;
    teacherIds: Array<number>;
  }): Promise<void> {
    const BOOKING_LENGTH = 10 * 60 * 1000; // TODO: Make this configurable
    const teachers = this.teacherService.getTeachersByIds(teacherIds);
    const duration = endsAt - startsAt;
    if (duration < 0) {
      throw Error("The meeting duration cannot be negative.");
    }
    const numberOfHours = Math.floor(duration / BOOKING_LENGTH);
    // @ts-ignore
    const hours = [...Array(numberOfHours).keys()].map((i: number) => {
      const start = new Date(startsAt + i * BOOKING_LENGTH);
      const end = new Date(start.getTime() + BOOKING_LENGTH);
      return {
        displayName: `${start.getHours().toString().padStart(2, "0")}:${start
          .getMinutes()
          .toString()
          .padStart(2, "0")} - ${end
          .getHours()
          .toString()
          .padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`,
      };
    });
    await this.model.create({
      startsAt,
      endsAt,
      teachers: teachers.map((teacher) => ({
        teacherName: teacher.name,
        bookings: [],
      })),
      hours,
    });
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @returns - Sanitised meeting ready to be presented to the user
   */
  public async getMeetingById(meetingId: string): Promise<MeetingDTO | null> {
    const meeting: IMeeting = await this.model.findById(
      new MongooseTypes.ObjectId(meetingId)
    );
    if (meeting === null || meeting.endsAt < new Date().getTime()) {
      return null;
    }
    return {
      startsAt: meeting.startsAt,
      endsAt: meeting.endsAt,
      hours: meeting.hours.map((hour) => ({
        id: hour._id.toString(),
        displayName: hour.displayName,
      })),
      teachers: meeting.teachers.map((teacher) => ({
        id: teacher._id.toString(),
        teacherName: teacher.teacherName,
        bookings: teacher.bookings.map((booking) => ({
          id: booking._id.toString(),
          hourId: booking.hourId.toString(),
        })),
      })),
    };
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param bookerToken - Token of the user getting the hours
   * @returns - Array of available hours for the specified teacher in the specified meeting, throws if the user has already booked an hour
   */
  public async getAvailableHoursByTeacherId(
    meetingId: string,
    teacherId: string,
    bookerToken: string
  ): Promise<Array<HourDTO>> {
    const meeting: IMeeting = await this.model.findOne({
      _id: meetingId,
      teachers: {
        $filter: {
          input: "$teachers",
          as: "teacher",
          cond: { $eq: ["$teacher._id", teacherId] },
        },
      },
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has ended, check your DB.");
    }
    if (meeting.teachers.length === 0) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      meeting.teachers[0].bookings.find(
        (booking) => booking.bookerToken === bookerToken
      )
    ) {
      throw Error("This user already has an hour booked for this teacher.");
    }
    return meeting.hours
      .filter(
        (hour) =>
          !meeting.teachers[0].bookings.find(
            (booking) => booking.hourId === hour._id
          )
      )
      .map((hour) => ({
        id: hour._id.toString(),
        displayName: hour.displayName,
      }));
  }
}
