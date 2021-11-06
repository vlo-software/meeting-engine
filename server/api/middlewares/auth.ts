import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../utils";

export const adminAuth = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization) {
    try {
      const jwtBody = await verifyJwt(req.headers.authorization.split(" ")[1]);
      res.locals.verifiedJwt = jwtBody;
      if (!jwtBody.admin) {
        res.sendStatus(401);
        return;
      }
      next();
    } catch {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

export const userAuth = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization) {
    try {
      const jwtBody = await verifyJwt(req.headers.authorization.split(" ")[1]);
      res.locals.verifiedJwt = jwtBody;
      next();
    } catch {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};
