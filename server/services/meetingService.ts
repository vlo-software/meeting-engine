import { Meeting, IMeeting } from "~~/database/models/meeting";
import { Types as MongooseTypes, Model } from "mongoose";
import { TeachersService } from "./teachersService";

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
  public async getAllMeetings(): Promise<Array<IMeeting>> {
    const rawMeetings = await this.model.find();
    return rawMeetings.map((item: any) => item.toObject()) as Array<IMeeting>;
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * !!! IT WILL EXPOSE PERSONAL DATA !!!
   * @param meetingId - Meeting _id from the database
   * @returns Meeting from the database in its raw form.
   */
  public async getMeetingById(meetingId: string): Promise<IMeeting | null> {
    const meeting = await this.model.findById(
      new MongooseTypes.ObjectId(meetingId)
    );
    return meeting ? (meeting.toObject() as IMeeting) : null;
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * It will just delete the meeting without asking questions.
   * @param meetingId - Meeting _id from the database
   */
  public async deleteMeetingById(meetingId: string): Promise<void> {
    await this.model.findByIdAndDelete(new MongooseTypes.ObjectId(meetingId));
  }
  /**
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * It will create a new meeting without asking questions.
   * @param data - Information about the meeting to create
   */
  public async addMeeting({
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
}
