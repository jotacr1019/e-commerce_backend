import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { corsMiddleware } from "lib/middlewares";
import { getAllProducts } from "controllers/products";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = await getAllProducts();
        if (!products) {
            res.status(404).send({
                message: "Products not found",
            });
            return;
        }
        res.status(200).send(products);
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}

const methodHandler = methods({
    get: handler,
});

// Execute the corsMiddleware and calls the methodHandler
export default corsMiddleware(methodHandler);
