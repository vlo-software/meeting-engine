import { ConfigTeacherDTO } from "../models/dto/teacher";
import { readFileSync } from "fs";
import { resolve } from "path";

const teachers = JSON.parse(
  readFileSync(resolve(process.cwd(), "config/teachers.json"), {
    encoding: "utf8",
  })
);

export class TeachersService {
  public getAllTeachers(): Array<ConfigTeacherDTO> {
    return teachers.map((item: { name: string }, idx: number) => ({
      name: item.name,
      id: idx,
    }));
  }
  public getTeachersByIds(ids: Array<number>): Array<ConfigTeacherDTO> {
    const filteredTeachers = ids.map((id: number) => ({
      ...teachers.find((_: any, idx: number) => idx === id),
      id,
    }));
    filteredTeachers.forEach((teacher: ConfigTeacherDTO | null) => {
      if (!teacher) {
        throw Error("Incorrect id.");
      }
    });
    return filteredTeachers;
  }
}
