import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { createOrder, getPaymentLink } from "controllers/order";
import { getProductById } from "controllers/products";

// https://webhook.site/6ed1bbeb-3cc2-4b64-a4b6-9f8cde7071ad
// https://e-commerce-backend-rho-blush.vercel.app/api/webHooks/tilopay

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
    const { productId } = req.query as any;
    const productInfo = req.body.productInfo;
    const clientName = req.body.clientInfo.clientName;
    if (!productId || !productInfo) {
        res.status(400).send({
            message: "productId and productInfo are required",
        });
        return;
    }

    const productFound = await getProductById(productId);
    if (!productFound) {
        res.status(404).send({
            message: "Product not found",
        });
        return;
    }

    const newOrder = await createOrder(
        token,
        productId,
        productInfo,
        productFound
    );

    const paymentLink = await getPaymentLink(
        clientName,
        newOrder.id,
        productFound
    );
    const { url, id } = paymentLink;

    if (!url || !id) {
        res.status(500).send({
            message: "An error occurred",
        });
        return;
    }

    res.status(200).send({ url, id });
}

const methodHandler = methods({
    post: handler,
});

export default authMiddleware(methodHandler);
