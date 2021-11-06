import { Request, Response } from "express";
// @ts-ignore
import Joi from "joi";
import { generateJwt } from "../../utils";

const schema = Joi.object({
  username: Joi.string().alphanum().min(4).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
});

export const postLogin = async (req: Request, res: Response) => {
  try {
    const body = await schema.validateAsync(req.body);
    const { ADMIN_USERNAME: username, ADMIN_PASSWORD: password } = process.env;
    if (!username || !password) {
      res.status(500).send("Missing user config.");
    }
    if (body.username !== username || body.password !== password) {
      res.status(401).send("Invalid credentials.");
    }
    const jwt = generateJwt({ admin: true });
    res.json({ jwt });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};
