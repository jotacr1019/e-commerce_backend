import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { Order } from "models/order";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let querySchema = object({
    orderId: string().required(),
});

async function handlerOrder(req: NextApiRequest, res: NextApiResponse) {
    const orderId = req.query.orderId as string;
    const order = await Order.getOrderById(orderId);
    if (!order.data) {
        res.status(404).send({
            message: "Order not found or not exist",
        });
    }
    res.status(200).send(order.data);
}

// Validate the token and execute the handlerOrder
const getHandlerAfterValidations = authMiddleware(handlerOrder);

// Call the getHandlerAfterValidations
const methodHandler = methods({
    get: getHandlerAfterValidations,
});

// Validate the query schema before calling the methodHandler
export default schemaMiddleware(
    [
        {
            schema: querySchema,
            reqType: "query",
        },
    ],
    methodHandler
);
