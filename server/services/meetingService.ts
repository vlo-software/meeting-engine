import { Meeting, IMeeting } from "../../database/models/meeting";
import mongoose from "mongoose";
const { Types: MongooseTypes, Model } = mongoose;
import { TeachersService } from "./teachersService";
import { MeetingDTO } from "../models/dto/meeting";
import { HourDTO } from "../models/dto/hours";
import nodemailer from "nodemailer";

export class MeetingService {
  private readonly model: typeof Model;
  private readonly teacherService: TeachersService;
  constructor() {
    this.model = Meeting;
    this.teacherService = new TeachersService();
  }
  private async sendEmail(
    transporter: any,
    email: string,
    subject: string,
    message: string,
    html?: string
  ): Promise<void> {
    console.log(process.env.SMTP_ALLOWED_SENDER_DOMAINS);
    return await transporter.sendMail({
      from: `VLO Meeting Engine <meeting@${process.env.SMTP_ALLOWED_SENDER_DOMAINS}>`,
      to: email,
      subject,
      text: message,
      html: html || message,
    });
  }
  private async getRidOfStaleBookings(meeting: IMeeting) {
    const now = new Date().getTime();
    const minutesToWaitForConfirmation: number = parseInt(
      process.env.MAX_CONFIRM_WAIT ?? "5"
    );
    meeting.teachers = meeting.teachers.map((teacher) => {
      teacher.bookings = teacher.bookings.filter(
        (booking) =>
          booking.status === "booked" ||
          booking.createdAt.getTime() +
            1000 * 60 * minutesToWaitForConfirmation >
            now
      );
      return teacher;
    });
    await (meeting as any).save();
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
    let meeting = await this.model.findById(
      new MongooseTypes.ObjectId(meetingId)
    );
    if (meeting === null || meeting.endsAt < new Date().getTime()) {
      return null;
    }
    await this.getRidOfStaleBookings(meeting);
    meeting = await this.model.findById(new MongooseTypes.ObjectId(meetingId));
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
    const BOOKING_LENGTH =
      parseInt(process.env.BOOKING_LENGTH ?? "10") * 60 * 1000;
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
   * !!! DO NOT USE THIS METHOD FOR NORMAL USERS !!!
   *
   * It will delete the meeting without asking questions.
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param bookingId - Booking _id from the database
   * @returns - Array of available hours for the specified teacher in the specified meeting, throws if the user has already booked an hour
   */
  public async deleteBookingUnsafe(
    meetingId: string,
    teacherId: string,
    bookingId: string
  ): Promise<void> {
    const meeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has already ended.");
    }
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      !meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find((booking) => booking._id.toString() === bookingId)
    ) {
      throw Error("This user doesn't have an hour booked with this teacher.");
    }
    meeting.teachers.find(
      (teacher) => teacher._id.toString() === teacherId
    ).bookings = meeting.teachers
      .find((teacher) => teacher._id.toString() === teacherId)
      .bookings.filter((booking) => booking._id.toString() != bookingId);
    await meeting.save();
  }

  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @returns - Sanitised meeting ready to be presented to the user
   */
  public async getMeetingById(meetingId: string): Promise<MeetingDTO | null> {
    let meeting: IMeeting = await this.model.findById(
      new MongooseTypes.ObjectId(meetingId)
    );
    if (meeting === null || meeting.endsAt < new Date().getTime()) {
      return null;
    }
    await this.getRidOfStaleBookings(meeting);
    meeting = await this.model.findById(new MongooseTypes.ObjectId(meetingId));
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
    let meeting: IMeeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has ended, check your DB.");
    }
    await this.getRidOfStaleBookings(meeting);
    meeting = await this.model.findOne({ _id: meetingId });
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find((booking) => booking.bookerToken === bookerToken)
    ) {
      throw Error("This user already has an hour booked for this teacher.");
    }
    return meeting.hours
      .filter(
        (hour) =>
          !meeting.teachers
            .find((teacher) => teacher._id.toString() === teacherId)
            .bookings.find(
              (booking) => booking.hourId.toString() === hour._id.toString()
            )
      )
      .map((hour) => ({
        id: hour._id.toString(),
        displayName: hour.displayName,
      }));
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param bookerToken - Token of the user getting the hours
   * @returns - Booking or null
   **/
  public async getBookingByTeacherId(
    meetingId: string,
    teacherId: string,
    bookerToken
  ) {
    let meeting: IMeeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has ended, check your DB.");
    }
    await this.getRidOfStaleBookings(meeting);
    meeting = await this.model.findOne({ _id: meetingId });
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    const teacher = meeting.teachers.find(
      (teacher) =>
        teacher._id.toString() === teacherId &&
        teacher.bookings.find((booking) => booking.bookerToken === bookerToken)
    );
    if (!teacher) return null;

    const booking: any = teacher.bookings.find(
      (booking) => booking.bookerToken === bookerToken
    );
    return {
      status: booking.status,
      hourDisplayName: meeting.hours.find(
        (hour) => hour._id.toString() === booking.hourId.toString()
      ).displayName,
    };
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param hourId - Hour _id from the database
   * @param userName - Name of the user booking the hour
   * @param className - Name of the class
   * @param bookerToken - Token of the user getting the hours
   * @returns - Array of available hours for the specified teacher in the specified meeting, throws if the user has already booked an hour
   */
  public async addBooking(
    meetingId: string,
    teacherId: string,
    hourId: string,
    userName: string,
    className: string,
    bookerToken: string,
    transporter: any,
    email: string
  ): Promise<void> {
    const meeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has already ended.");
    }
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find((booking) => booking.bookerToken === bookerToken)
    ) {
      throw Error("This user already has an hour booked for this teacher.");
    }
    const hour = meeting.hours.find((hour) => hour._id.toString() === hourId);
    if (!hour) {
      throw Error("The hour with this id doesn't exist in this meeting.");
    }
    if (
      meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find(
          (booking) => booking.hourId.toString() === hour._id.toString()
        )
    ) {
      throw Error("This hour is already booked.");
    }
    meeting.teachers = meeting.teachers.map((teacher) => {
      if (teacher._id.toString() === teacherId) {
        teacher.bookings.push({
          hourId: hour._id,
          userName,
          bookerToken,
          className,
          status: "pending",
          email,
        });
      }
      return teacher;
    });
    await meeting.save();
    const booking = (await this.model.findOne({ _id: meetingId })).teachers
      .find((teacher) => teacher._id.toString() === teacherId)
      .bookings.find((booking) => booking.bookerToken === bookerToken);
    const link = process.env.URL;
    const info = await this.sendEmail(
      transporter,
      email,
      "VLO - Potwierdź spotkanie",
      `Próbujesz dodać spotkanie na ${hour.displayName.split(" - ")[0]} z ${
        meeting.teachers.find((teacher) => teacher._id.toString() === teacherId)
          .teacherName
      }\nAby je potwierdzić, kliknij w link: ${link}/confirm/${meetingId}/teachers/${teacherId}/bookings/${
        booking._id
      }`,
      `<table width = "100%" border = "0"><tr><td colspan = "2" bgcolor = "#FFF"><img alt="School logo" title="School Logo" style="display:block;margin-left: auto;margin-right: auto;" width="200px" height="152px" src="https://cdn.discordapp.com/attachments/769540548834885673/1036654603531468800/SchoolLogo.png"/></td></tr><tr valign = "top"><td bgcolor = "#FFF" style="text-align: center; font-family: sans-serif" width = "100" height = "200"><h2 style="color: #232c33; ">Próbujesz dodać spotkanie na ${
        hour.displayName.split(" - ")[0]
      } z ${
        meeting.teachers.find((teacher) => teacher._id.toString() === teacherId)
          .teacherName
      }</h2><br/><br/><a style="text-decoration: none; color: white; background: #00c96f; padding: 20px 50px; font-weight: bold; font-size: 20px; border-radius: 20px" href="${link}/confirm/${meetingId}/teachers/${teacherId}/bookings/${
        booking._id
      }">Potwierdź spotkanie</a></td></tr><tr><td colspan = "2" bgcolor = "#fff"><center><small style="font-family: sans-serif">Copyright © 2022 VLO</small></center></td></tr></table>`
    );
    console.log(nodemailer.getTestMessageUrl(info));
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param bookerToken - Token of the user getting the hours
   * @returns - Array of available hours for the specified teacher in the specified meeting, throws if the user has already booked an hour
   */
  public async confirmBooking(
    meetingId: string,
    teacherId: string,
    bookingId: string,
    transporter: any
  ): Promise<void> {
    let meeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has already ended.");
    }
    await this.getRidOfStaleBookings(meeting);
    meeting = await this.model.findOne({ _id: meetingId });
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      !meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find((booking) => booking._id.toString() === bookingId)
    ) {
      throw Error("This user doesn't have an hour reserved for this teacher.");
    }
    let hour = null;
    let bookerToken = null;
    let email = null;
    meeting.teachers = meeting.teachers.map((teacher) => {
      if (teacher._id.toString() === teacherId) {
        teacher.bookings = teacher.bookings.map((booking) => {
          if (booking._id.toString() === bookingId) {
            booking.status = "booked";
            hour = booking.hourId.toString();
            bookerToken = booking.bookerToken;
            email = booking.email;
          }
          return booking;
        });
      }
      return teacher;
    });
    await meeting.save();

    console.log(hour, bookerToken, email);
    hour = meeting.hours.find((h) => h._id.toString() === hour);

    const link = process.env.URL;
    const info = await this.sendEmail(
      transporter,
      email,
      "VLO - Zaplanowano nowe spotkanie",
      `Dodano spotkanie na ${hour.displayName.split(" - ")[0]} z ${
        meeting.teachers.find((teacher) => teacher._id.toString() === teacherId)
          .teacherName
      }\nAby je odwołać, kliknij w link: ${link}/cancel/${meetingId}/teachers/${teacherId}/booker/${bookerToken}"`,
      `<table width = "100%" border = "0"><tr><td colspan = "2" bgcolor = "#FFF"><img alt="School logo" title="School Logo" style="display:block;margin-left: auto;margin-right: auto;" width="200px" height="152px" src="https://cdn.discordapp.com/attachments/769540548834885673/1036654603531468800/SchoolLogo.png"/></td></tr><tr valign = "top"><td bgcolor = "#FFF" style="text-align: center; font-family: sans-serif" width = "100" height = "200"><h2 style="color: #232c33; ">Dodano spotkanie na ${
        hour.displayName.split(" - ")[0]
      } z ${
        meeting.teachers.find((teacher) => teacher._id.toString() === teacherId)
          .teacherName
      }</h2><br/><br/><a style="text-decoration: none; color: white; background: #FF5252; padding: 20px 50px; font-weight: bold; font-size: 20px; border-radius: 20px" href="${link}/cancel/${meetingId}/teachers/${teacherId}/booker/${bookerToken}">Odwołaj spotkanie</a></td></tr><tr><td colspan = "2" bgcolor = "#fff"><center><small style="font-family: sans-serif">Copyright © 2022 VLO</small></center></td></tr></table>`
    );
    console.log(nodemailer.getTestMessageUrl(info));
  }
  /**
   * This is safe to use for normal users
   * @param meetingId - Meeting _id from the database
   * @param teacherId - Teacher _id from the database
   * @param bookerToken - Token of the user getting the hours
   * @returns - Array of available hours for the specified teacher in the specified meeting, throws if the user has already booked an hour
   */
  public async deleteBooking(
    meetingId: string,
    teacherId: string,
    bookerToken: string
  ): Promise<void> {
    const meeting = await this.model.findOne({
      _id: meetingId,
    });
    if (meeting.endsAt < new Date().getTime()) {
      throw Error("The meeting has already ended.");
    }
    if (
      !meeting.teachers.some((teacher) => teacher._id.toString() === teacherId)
    ) {
      throw Error("The teacher with this id doesn't exist in this meeting.");
    }
    if (
      !meeting.teachers
        .find((teacher) => teacher._id.toString() === teacherId)
        .bookings.find((booking) => booking.bookerToken === bookerToken)
    ) {
      throw Error("This user doesn't have an hour booked with this teacher.");
    }
    meeting.teachers.find(
      (teacher) => teacher._id.toString() === teacherId
    ).bookings = meeting.teachers
      .find((teacher) => teacher._id.toString() === teacherId)
      .bookings.filter((booking) => booking.bookerToken != bookerToken);
    await meeting.save();
  }
}
