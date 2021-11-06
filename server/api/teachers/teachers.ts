import { Request, Response } from "express";
import { TeachersService } from "../../services/teachersService";

export const getTeacherConfig = async (req: Request, res: Response) => {
  const teachersService = new TeachersService();
  res.json(teachersService.getAllTeachers());
};
