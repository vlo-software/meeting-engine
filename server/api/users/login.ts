import type { IncomingMessage, ServerResponse } from "http";
// @ts-ignore
import Joi from "joi";
import { useBody } from "h3";
import { generateJwt } from "~~/server/utils";

const schema = Joi.object({
  username: Joi.string().alphanum().min(4).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
});

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return "Method not allowed.";
  }
  try {
    const body = await schema.validateAsync(await useBody(req));
    const { ADMIN_USERNAME: username, ADMIN_PASSWORD: password } = process.env;
    if (!username || !password) {
      res.statusCode = 500;
      return "Missing user config.";
    }
    if (body.username !== username || body.password !== password) {
      res.statusCode = 401;
      return "Invalid credentials.";
    }
    const jwt = generateJwt({ admin: true });
    return { jwt };
  } catch (e: any) {
    res.statusCode = 400;
    return e.message;
  }
};
