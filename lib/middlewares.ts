import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import parseToken from "parse-bearer-token";
import { decodeToken } from "./jwt";

export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        const token = parseToken(req);
        if (!token) {
            res.status(400).send({
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
        callback(req, res, decodedToken["userId"]);
    };
}

export function schemaMiddleware(schemas, callback) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        if (!req.body && Object.keys(req.query).length === 0) {
            callback(req, res);
            return;
        }

        let hasError = false;
        for (const schema of schemas) {
            try {
                await schema.schema.validate(req[schema.reqType]);
            } catch (e) {
                res.status(400).send({
                    field: schema.reqType,
                    error: e,
                });
                hasError = true;
                break;
            }
        }
        if (!hasError) {
            callback(req, res);
        }
    };
}

export function corsMiddleware(callback) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        try {
            await NextCors(req, res, {
                methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
                origin: "*",
                optionsSuccessStatus: 200,
            });

            callback(req, res);
        } catch (e) {
            res.status(500).send({
                message: "An error occurred in corsMiddleware",
                error: e,
            });
        }
    };
}
