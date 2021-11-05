// @ts-ignore
import jwt from "jsonwebtoken";

export type IJwtBody =
  | {
      bookerToken: string;
      admin: false;
    }
  | {
      admin: true;
    };

export const generateJwt = (data: IJwtBody): string => {
  if (!process.env.JWT_SECRET) {
    throw Error("Missing jwt secret.");
  }
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "48h" });
};

export const verifyJwt = (jwtToVerify: string): Promise<IJwtBody> =>
  new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET) {
      reject(Error("Missing jwt secret."));
      return;
    }
    jwt.verify(
      jwtToVerify,
      process.env.JWT_SECRET,
      (err: any, data: IJwtBody) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      }
    );
  });
