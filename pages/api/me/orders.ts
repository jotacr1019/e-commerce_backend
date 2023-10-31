import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { Order } from "models/order";

type TokenData = {
    userId: string;
};

async function getOrdersOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    token: TokenData
) {
    const ordersOfUser = await Order.getOrdersOfUser(token.userId);
    if (!ordersOfUser) {
        res.status(404).send({
            message: "Not found any orders",
        });
        return;
    }
    const response = ordersOfUser.map((order) => {
        return {
            data: order.data,
        };
    });
    res.status(200).send(response);
}

const handlerMethods = methods({
    get: getOrdersOfUser,
});

export default authMiddleware(handlerMethods);
