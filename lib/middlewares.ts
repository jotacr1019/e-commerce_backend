import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decodeToken } from "lib/jwt";

export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({
                message: "Token required",
            });
            return;
        }

        const decodedToken = decodeToken(token);

        if (!decodedToken) {
            res.status(401).send({
                message: "Not authorized, invalid token",
            });
            return;
        }
        callback(req, res, decodedToken);
    };
}
