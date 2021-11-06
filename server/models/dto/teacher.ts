import { BookingDTO } from "./booking";

export interface ConfigTeacherDTO {
  id: number;
  name: string;
}
export interface TeacherDTO {
  id: string;
  teacherName: string;
  bookings: Array<BookingDTO>;
}
