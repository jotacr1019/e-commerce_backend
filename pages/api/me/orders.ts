import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware, corsMiddleware } from "lib/middlewares";
import { Order } from "models/order";

async function getOrdersOfUser(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    const ordersOfUser = await Order.getOrdersOfUser(userId);
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

// Call the getOrdersOfUser function
const handlerMethods = methods({
    get: getOrdersOfUser,
});

// Validate the token before calling the handlerMethods
const validateToken = authMiddleware(handlerMethods);

// Execute the corsMiddleware and calls the validateToken
export default corsMiddleware(validateToken);
