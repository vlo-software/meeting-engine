import mongoose from "mongoose";
import { resolve as pathResolve } from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: pathResolve(process.cwd(), ".env") });

import express from "express";
import { TeachersRouter } from "./teachers";
import { LoginRouter } from "./users";
import { AdminRouter } from "./admin";

const app = express();

const setup = async () => {
  const connectionUri = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  await mongoose.connect(connectionUri);
  app.use(express.json());
  app.use("/api/teachers", TeachersRouter);
  app.use("/api/users", LoginRouter);
  app.use("/api/admin", AdminRouter);
};

setup();

export default app;
