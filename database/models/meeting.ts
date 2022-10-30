// @ts-ignore - tslint doesn't like the import
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    userName: { type: String, required: true },
    className: { type: String, required: true },
    hourId: { type: mongoose.Types.ObjectId, required: true },
    bookerToken: { type: String, required: true },
    status: { type: String, enum: ["booked", "pending"], required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const teacherSchema = new Schema({
  teacherName: { type: String, required: true },
  bookings: [bookingSchema],
});

const hourSchema = new Schema({
  displayName: { type: String, required: true },
});

const meetingSchema = new Schema({
  startsAt: { type: Number, require: true },
  endsAt: { type: Number, require: true },
  teachers: [teacherSchema],
  hours: [hourSchema],
});

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  userName: string;
  className: string;
  hourId: mongoose.Types.ObjectId;
  bookerToken: string;
  status: "booked" | "pending";
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeacher {
  _id: mongoose.Types.ObjectId;
  teacherName: string;
  bookings: Array<IBooking>;
}

export interface IHour {
  _id: mongoose.Types.ObjectId;
  displayName: string;
}

export interface IMeeting {
  _id: mongoose.Types.ObjectId;
  startsAt: number;
  endsAt: number;
  teachers: Array<ITeacher>;
  hours: Array<IHour>;
}

export const Meeting = model("Meeting", meetingSchema);
