import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "models/user";
import { Auth } from "models/auth";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let bodySchema = object({
    email: string(),
    userName: string(),
});

type TokenData = {
    userId: string;
};

async function getInfoOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    token: TokenData
) {
    const user = new User(token.userId);
    await user.pullUserData();
    res.status(200).send(user.data);
}

async function updateDataOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    token: TokenData
) {
    const user = new User(token.userId);
    user.data = req.body;
    await user.pushUserData();

    const auth = await Auth.findByUserId(token.userId);
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
export default schemaMiddleware(
    [
        {
            schema: bodySchema,
            reqType: "body",
        },
    ],
    methodHandler
);
