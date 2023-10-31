import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "controllers/products";

export default methods({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
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
    },
});
