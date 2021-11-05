import type { IncomingMessage, ServerResponse } from "http";
import { useQuery } from "h3";
import { TeachersService } from "../services/teachersService";
// @ts-ignore
import Joi from "joi";

const arraySchema = Joi.object({
  ids: Joi.array().items(Joi.number().min(0)).required(),
});

const numberSchema = Joi.object({
  ids: Joi.number().min(0).required(),
});

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return "Method not allowed.";
  }
  const teachersService = new TeachersService();
  const query = useQuery(req);
  if (!query.ids) {
    return teachersService.getAllTeachers();
  }
  try {
    if (Array.isArray(query.ids)) {
      const { ids } = await arraySchema.validateAsync(query);
      return teachersService.getTeachersByIds(ids);
    }
    const { ids } = await numberSchema.validateAsync(query);
    return teachersService.getTeachersByIds([ids]);
  } catch (e: any) {
    res.statusCode = 400;
    return e.message;
  }
};
