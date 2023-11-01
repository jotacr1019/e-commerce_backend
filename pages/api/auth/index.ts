import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCodeToUser } from "controllers/auth";
import { schemaMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string().required(),
    userName: string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email } = req.body;
        const userName = req.body.userName ? req.body.userName : "Usuario";

        const response = await sendCodeToUser(email, userName);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

// Execute the handler function
const methodHandler = methods({
    post: handler,
});

// Validate the body schema before calling the methodHandler
export default schemaMiddleware(
    [
        {
            schema: bodySchema,
            reqType: "body",
        },
    ],
    methodHandler
);
