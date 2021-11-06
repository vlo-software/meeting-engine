import { HourDTO } from "./hours";
import { TeacherDTO } from "./teacher";

export interface MeetingDTO {
  startsAt: number;
  endsAt: number;
  hours: Array<HourDTO>;
  teachers: Array<TeacherDTO>;
}
