import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getTokenFromTiloPay, createPaymentLink } from "lib/apiTiloPay";
import { createOrder } from "controllers/order";
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

    const product = await getProductById(productId);
    if (!product) {
        res.status(404).send({
            message: "Product not found",
        });
        return;
    }

    const newOrder = await createOrder(token, productId, productInfo, product);

    const tilopayResponse = await getTokenFromTiloPay();
    const tilopayToken = tilopayResponse.access_token;

    const dataForPaymentLink = {
        amount: product.object["Unit cost"],
        currency: product.object["Currency"],
        type: 1,
        description: "Buying a soft red bed",
        client: clientName,
        callback_url:
            "https://e-commerce-backend-rho-blush.vercel.app/api/webHooks/tilopay",
    };

    const paymentLink = await createPaymentLink(
        tilopayToken,
        dataForPaymentLink,
        newOrder.id
    );
    const { url, id } = paymentLink;

    res.status(200).send({ url, id });
}

const methodHandler = methods({
    post: handler,
});

export default authMiddleware(methodHandler);
