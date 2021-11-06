//@ts-ignore
import mongoose from "mongoose";
import { resolve as pathResolve } from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: pathResolve(process.cwd(), ".env") });

// @ts-ignore
import express from "express";
import { TeachersRouter } from "./teachers";
import { LoginRouter } from "./users";
import { AdminRouter } from "./admin";

const app = express();

const setup = async () => {
  const connectionUri = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  await mongoose.connect(connectionUri);
  app.use(express.json());
  app.use("/teachers", TeachersRouter);
  app.use("/users", LoginRouter);
  app.use("/admin", AdminRouter);
};

setup();

export default app;
