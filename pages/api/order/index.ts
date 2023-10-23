import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getTokenFromTiloPay, createPaymentLink } from "lib/apiTiloPay";
import { createOrder } from "controllers/order";
import { getProductById } from "controllers/products";

const mockData = {
    amount: "770",
    currency: "USD",
    type: 1,
    description: "Buying a soft red bed",
    client: "Jota nuevo 2",
    return_data: {
        title: "soft bed",
    },
    callback_url: "https://webhook.site/6ed1bbeb-3cc2-4b64-a4b6-9f8cde7071ad",
};

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
    const { productId } = req.query as any; // as any?
    const productInfo = req.body;
    if (!productId || !productInfo) {
        res.status(400).send({
            message: "productId and productInfo are required",
        });
        return;
    }

    const product = await getProductById(productId);
    if (!product) {
        res.status(404).send({
            message: "Product not found",
        });
        return;
    }

    const newOrder = await createOrder(token, productId, productInfo);

    const resp = await getTokenFromTiloPay();
    const tilopayToken = resp.access_token;

    // // productInfo.amount OR go to DB with productId
    const link = await createPaymentLink(tilopayToken, mockData, newOrder.id);
    const { url, id } = link;
    res.status(200).send({ url, id });
}

const methodHandler = methods({
    post: handler,
});

export default authMiddleware(methodHandler);
