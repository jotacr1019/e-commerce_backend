import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { Auth } from "models/auth";
import { generateToken } from "lib/jwt";
import { schemaMiddleware, corsMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string().required(),
    code: string().required(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, code } = req.body;

    const auth = await Auth.findByEmailAndCode(email, code);
    if (!auth) {
        res.status(404).send({
            message: "Email or code not match",
        });
        return;
    }
    const hasDateExpired = auth.isCodeExpired();
    if (hasDateExpired) {
        res.status(401).send({
            message: "Code expired",
        });
        return;
    }
    const token = generateToken({ userId: auth.data.userId });
    res.status(200).send({ token });
}

// Execute the handler function
const methodHandler = methods({
    post: handler,
});

// Validate the body schema before calling the methodHandler
const validateSchema = schemaMiddleware(
    [
        {
            schema: bodySchema,
            reqType: "body",
        },
    ],
    methodHandler
);

// Execute the corsMiddleware and calls the validateSchema
export default corsMiddleware(validateSchema);
