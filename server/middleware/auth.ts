import type { IncomingMessage, ServerResponse } from "http";
import { verifyJwt } from "../utils";

export default async function (
  req: IncomingMessage,
  res: ServerResponse,
  next: any
) {
  if (req.headers.authorization) {
    const jwtBody = await verifyJwt(req.headers.authorization.split(" ")[1]);
    (req as any).verifiedJwt = jwtBody;
  }
  next();
}
