import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { Order } from "models/order";

async function handlerOrder(req: NextApiRequest, res: NextApiResponse, token) {
    const orderId = req.query.orderId as string;
    const order = await Order.getOrderById(orderId);
    if (!order.data) {
        res.status(404).send({
            message: "Order not found or not exist",
        });
    }
    res.status(200).send(order.data);
}

const methodHandler = methods({
    get: handlerOrder,
});

export default authMiddleware(methodHandler);
