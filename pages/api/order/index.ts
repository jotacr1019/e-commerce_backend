import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createOrder, getPaymentLink } from "controllers/order";
import { getProductById } from "controllers/products";
import {
    authMiddleware,
    schemaMiddleware,
    corsMiddleware,
} from "lib/middlewares";
import { object, string, number } from "yup";

let querySchema = object({
    productId: string().required(),
});

let bodySchema = object({
    productInfo: object({
        color: string(),
        size: string(),
        quantity: number(),
        material: string(),
    })
        .noUnknown(true)
        .strict(),
    clientInfo: object({
        clientName: string().required(),
    }),
})
    .noUnknown(true)
    .strict();

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
) {
    try {
        const { productId } = req.query as any;
        const productInfo = req.body.productInfo;
        const clientName = req.body.clientInfo.clientName;

        const productFound = await getProductById(productId);
        if (!productFound) {
            res.status(404).send({
                message: "Product not found",
            });
            return;
        }

        const newOrder = await createOrder(
            userId,
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

        res.status(200).send({ url, id });
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

// Validate the token and execute the handler
const postHandlerAfterValidations = authMiddleware(handler);

// Call the postHandlerAfterValidations
const methodHandler = methods({
    post: postHandlerAfterValidations,
});

// Validate the query and body schemas before calling the methodHandler
const validateSchema = schemaMiddleware(
    [
        {
            schema: querySchema,
            reqType: "query",
        },
        {
            schema: bodySchema,
            reqType: "body",
        },
    ],
    methodHandler
);

// Execute the corsMiddleware and calls the validateSchema
export default corsMiddleware(validateSchema);
