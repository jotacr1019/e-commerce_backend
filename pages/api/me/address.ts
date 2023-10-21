import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";

type TokenData = {
    userId: string;
};

async function updateAddressOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    token: TokenData
) {
    const user = new User(token.userId);
    user.data.address = req.body.address;
    await user.pushUserData();
    res.status(200).send(user.data.address);
}

const handlerMethods = methods({
    patch: updateAddressOfUser,
});

export default authMiddleware(handlerMethods);
