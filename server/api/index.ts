import mongoose from "mongoose";
import { resolve as pathResolve } from "path";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config({ path: pathResolve(process.cwd(), ".env") });

const setupEmailTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
};

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return transporter;
};

import express from "express";
import { TeachersRouter } from "./teachers";
import { LoginRouter } from "./users";
import { AdminRouter } from "./admin";
import { MeetingRouter } from "./meetings";

const app = express();

const setup = async () => {
  const connectionUri = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  await mongoose.connect(connectionUri);
  app.use(express.json());
  app.use(cookieParser(process.env.JWT_SECRET));

  const emailTransporter = process.env.SMTP_HOST
    ? await createTransporter()
    : await setupEmailTestAccount();
  app.use((_, res, next) => {
    res.locals.emailTransporter = emailTransporter;
    next();
  });

  app.use("/api/teachers", TeachersRouter);
  app.use("/api/users", LoginRouter);
  app.use("/api/admin", AdminRouter);
  app.use("/api/meetings", MeetingRouter);
};

setup();

export default app;
