import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";
import { Auth } from "models/auth";

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

const handlerMethods = methods({
    get: getInfoOfUser,
    patch: updateDataOfUser,
});

export default authMiddleware(handlerMethods);
