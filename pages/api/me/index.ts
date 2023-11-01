import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";
import { Auth } from "models/auth";
import { object, string, number, date, InferType } from "yup";

let bodySchema = object({
    email: string(),
})
    .noUnknown(true)
    .strict();

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
    try {
        await bodySchema.validate(req.body);
    } catch (e) {
        res.status(400).send({
            field: "body",
            error: e,
        });
    }
    const user = new User(token.userId);
    user.data = req.body;
    await user.pushUserData();
    const auth = await Auth.findByUserId(token.userId);
    auth.data.email = req.body.email;
    await auth.pushUserData();
    res.status(200).send(user.data);
}

const handlerMethods = methods({
    get: getInfoOfUser,
    patch: updateDataOfUser,
});

export default authMiddleware(handlerMethods);
