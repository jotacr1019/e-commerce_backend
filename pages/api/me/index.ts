import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import { Auth } from "models/auth";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string(),
    userName: string(),
});

async function getInfoOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    await user.pullUserData();
    res.status(200).send(user.data);
}

async function updateDataOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const user = new User(userId);
    user.data = req.body;
    await user.pushUserData();

    const auth = await Auth.findByUserId(userId);
    auth.data.email = req.body.email;
    await auth.pushUserData();

    res.status(200).send(user.data);
}

// Validate the token and execute the updateDataOfUser and getInfoOfUser
const patchHandlerAfterValidations = authMiddleware(updateDataOfUser);
const getHandlerAfterValidations = authMiddleware(getInfoOfUser);

// Call the patchHandlerAfterValidations and getHandlerAfterValidations
const methodHandler = methods({
    get: getHandlerAfterValidations,
    patch: patchHandlerAfterValidations,
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
