import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "controllers/products";
import { schemaMiddleware } from "lib/middlewares";
import { object, string } from "yup";

let querySchema = object({
    productId: string().required(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const productId = req.query.productId as string;
        const product = await getProductById(productId);
        if (!product) {
            res.status(404).send({
                message: "Product not found",
            });
            return;
        }
        res.status(200).send(product);
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

// Execute the handler function
const methodHandler = methods({
    get: handler,
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
