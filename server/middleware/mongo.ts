import mongoose from "mongoose";

let dbIsConnected = false;

const connectToDb = async () => {
  const connectionUri = `mongodb://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  await mongoose.connect(connectionUri);
}

connectToDb().then(() => {dbIsConnected = true});

export default async function (req, res, next) {
  if (dbIsConnected) {
    next();
    return;
  }
  let tryCounter = 0;
  while (tryCounter < 80) {
    await new Promise((resolve, _) => setTimeout(resolve, 100)); // Wait 100 ms
    if (dbIsConnected) {
      next();
      return;
    }
    tryCounter++;
  }
  res.statusCode = 500;
  res.end("Failed connecting to mongodb!");
}